import { Request, Response, NextFunction } from "express";
import { registerUser, loginUser } from "../services/auth.service";

export async function getRegister(_req: Request, res: Response) {
  res.render("pages/register.njk", { title: "Register" });
}

export async function postRegister(req: Request, res: Response, next: NextFunction) {
  try {
    await registerUser(req.body);
    req.session.regenerate((err) => {
      if (err) return next(err);
      res.redirect("/login?registered=1");
    });
  } catch (err: any) {
    res.render("pages/register.njk", {
      title: "Register",
      error: err.message,
      form: { name: req.body.name, email: req.body.email },
    });
  }
}

export async function getLogin(req: Request, res: Response) {
  res.render("pages/login.njk", {
    title: "Login",
    registered: req.query.registered === "1",
  });
}

export async function postLogin(req: Request, res: Response) {
  try {
    const user = await loginUser(req.body);

    req.session.regenerate((err) => {
      if (err) throw err;
      req.session.userId = user.id;
      res.redirect("/dashboard");
    });
  } catch (err: any) {
    res.render("pages/login.njk", {
      title: "Login",
      error: err.message,
      form: { email: req.body.email },
    });
  }
}

export async function logout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect("/dashboard");
    }
    res.clearCookie("connect.sid");
    res.redirect("/login");
  });
}
