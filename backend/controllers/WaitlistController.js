const BaseController = require("./BaseController");
const Waitlist = require("../models/Waitlist");

class WaitlistController extends BaseController {
    constructor() {
        super();
        this.BASE_COUNT = 780; // Start the count from here to build hype
    }

    async join(req, res) {
        try {
            const { email } = req.body;
            if (!email) {
                return this.badRequest(res, "Email is required");
            }

            // Simple email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return this.badRequest(res, "Please provide a valid email address");
            }

            // Check if already in waitlist
            const existing = await Waitlist.findOne({ email: email.toLowerCase() });
            if (existing) {
                return this.badRequest(res, "You are already on the waitlist!");
            }

            // Save to DB
            const newEntry = new Waitlist({ email });
            await newEntry.save();

            // Get new count
            const dbCount = await Waitlist.countDocuments();
            const totalCount = this.BASE_COUNT + dbCount;

            return this.success(res, { 
                message: "Successfully joined the waitlist!", 
                count: totalCount 
            });
        } catch (err) {
            return this.handleError(res, err);
        }
    }

    async getCount(req, res) {
        try {
            const dbCount = await Waitlist.countDocuments();
            const totalCount = this.BASE_COUNT + dbCount;
            return this.success(res, { count: totalCount });
        } catch (err) {
            return this.handleError(res, err);
        }
    }
}

module.exports = new WaitlistController();
