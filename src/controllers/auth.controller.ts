import { Request, Response } from "express";
import AuthService from "../services/auth.services";
import { generateRefreshToken, generateToken } from "../utils/jwtHandler";

export default class AuthController {
  static async register(req: Request, res: Response) {
    try {
      await AuthService.register(req.body);
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const user = await AuthService.login(req.body);

      // access token
      const accessToken = generateToken(user);
      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        path: "/",
      });

      // refresh token
      // const refreshToken = generateRefreshToken(user);
      // res.cookie("refreshToken", refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   path: "/",
      // });

      res.status(200).json({ message: "User logged in successfully", user });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
  static async logout(req: Request, res: Response) {
    try {
      res.clearCookie("accessToken");
      res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  public static async checkAuth(req: Request, res: Response) {
    // Check if user is authenticated
    try {
      res.json(res.locals.user);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
      }
    }
  }
}
