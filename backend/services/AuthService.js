const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRepository = require("../repositories/UserRepository");

class AuthService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async signup({ email, password, name, creatorId, role }) {
        const existingUser = await this.userRepository.findByEmail(email);
        if (existingUser) {
            throw { status: 400, message: "User already exists" };
        }

        const hashedPassword = await bcrypt.hash(password, 7);
        const newUser = await this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            creatorId: creatorId || null,
            role: role || "creator",
        });

        return {
            _id: newUser._id,
            email: newUser.email,
            role: newUser.role,
        };
    }

    async signin({ email, password }) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw { status: 401, message: "Invalid credentials" };
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET_USER
        );

        return { token, email: user.email };
    }

    async getProfile(userId) {
        const user = await this.userRepository.findByIdWithoutPassword(userId);
        if (!user) {
            throw { status: 404, message: "User not found" };
        }
        return user;
    }

    async getEditors(creatorId) {
        return this.userRepository.findEditorsByCreatorId(creatorId);
    }

    async removeEditor(editorId, creatorId) {
        const editor = await this.userRepository.findOne({
            _id: editorId,
            creatorId,
        });

        if (!editor) {
            throw { status: 404, message: "Editor not found or not associated with you." };
        }

        await this.userRepository.unlinkEditor(editorId);
        return { message: "Editor removed successfully" };
    }

    generateToken(userId) {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET_USER);
    }

    generateAdminToken(adminId) {
        return jwt.sign({ id: adminId }, process.env.JWT_SECRET_ADMIN);
    }

    getCookieOptions() {
        return {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 1000 * 60 * 60 * 24 * 7,
        };
    }
}

module.exports = new AuthService(UserRepository);
