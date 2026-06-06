import express from "express";
import session from "express-session";
import helmet from "helmet";
import nunjucks from "nunjucks";
import path from "path";
import { urlencoded, json } from "body-parser";
import "dotenv/config";

import { config } from "./config";
import { generalLimiter } from "./middleware/rateLimiter";
import { csrfProtection } from "./middleware/csrf";
import { errorHandler } from "./middleware/errorHandler";
import { isAuthenticated } from "./middleware/auth";

import authRoutes from "./routes/auth.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";

import prisma from "./lib/prisma";

const app = express();

const env = nunjucks.configure(path.join(__dirname, "views"), {
  autoescape: true,
  express: app,
  noCache: !config.isProduction,
});

env.addFilter("date", function (date: Date | string, format: string) {
  const d = new Date(date);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  if (format === "MMM D, YYYY") {
    return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
  return d.toISOString().split("T")[0];
});

env.addFilter("truncate", function (str: string, len: number) {
  if (!str) return "";
  return str.length > len ? str.substring(0, len) + "..." : str;
});

app.set("view engine", "njk");

app.use(urlencoded({ extended: false }));
app.use(json());

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.tailwindcss.com", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:"],
    },
  },
}));

app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: config.isProduction,
    sameSite: "strict",
    maxAge: config.session.maxAge,
  },
}));

app.use((req, _res, next) => {
  _res.locals.session = req.session;
  next();
});

app.use(generalLimiter);
app.use(csrfProtection);

app.use("/", authRoutes);
app.use("/projects", projectRoutes);
app.use("/tasks", taskRoutes);

app.get("/", (_req, res) => {
  if (_req.session.userId) return res.redirect("/dashboard");
  res.redirect("/login");
});

app.get("/dashboard", isAuthenticated, async (req, res) => {
  const userId = req.session.userId!;

  const [totalProjects, tasks] = await Promise.all([
    prisma.project.count({ where: { ownerId: userId } }),
    prisma.task.findMany({
      where: { project: { ownerId: userId } },
      select: { status: true },
    }),
  ]);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  const recentProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  res.render("pages/dashboard.njk", {
    title: "Dashboard",
    stats: { totalProjects, totalTasks, completedTasks },
    recentProjects,
  });
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use((_req, res) => {
  res.status(404).render("pages/404.njk", { title: "Not Found" });
});

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
});

export default app;
