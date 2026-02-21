const BaseController = require("./BaseController");
const AuthService = require("../services/AuthService");

class AuthController extends BaseController {
    constructor(authService) {
        super();
        this.authService = authService;
    }

    async signup(req, res) {
        try {
            const user = await this.authService.signup(req.body);
            return this.success(res, { message: "User Created", user });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async signin(req, res) {
        try {
            const { token, email } = await this.authService.signin(req.body);
            res.cookie("auth", token, this.authService.getCookieOptions());
            return this.success(res, { token });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getProfile(req, res) {
        try {
            const user = await this.authService.getProfile(req.userId);
            return this.success(res, user);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async updateSettings(req, res) {
        try {
            const UserRepository = require("../repositories/UserRepository");
            const user = await UserRepository.updateSettings(req.userId, req.body.settings);
            return this.success(res, { message: "Settings updated", user });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getEditors(req, res) {
        try {
            const editors = await this.authService.getEditors(req.userId);
            return this.success(res, editors);
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async removeEditor(req, res) {
        try {
            const result = await this.authService.removeEditor(req.params.id, req.userId);
            return this.success(res, result);
        } catch (err) {
            return this.handleError(res, err);
        }
    }
}

module.exports = new AuthController(AuthService);
