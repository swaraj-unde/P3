import mailgen from "mailgen";
import nodemailer from "nodemailer";
import { ApiError } from "./ApiError.js";

const sendEmail = async (options) => {
    const mailGenerator = new mailgen({
        theme: "default",
        product: {
            name: "Task Manager",
            link: "https://taskmanagerlink.com",
        },
    });

    const emailText = mailGenerator.generatePlaintext(options.mailgenContent);

    const emailHTML = mailGenerator.generate(options.mailgenContent);

    const transporter = nodemailer.createTransport({
        host: process.env.MAILTRAP_SMTP_HOST,
        port: Number(process.env.MAILTRAP_SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.MAILTRAP_SMTP_USER,
            pass: process.env.MAILTRAP_SMTP_PASS,
        },
    });

    const mail = {
        from: process.env.MAIL_FROM,
        to: options.email,
        subject: options.subject,
        text: emailText,
        html: emailHTML,
    };

    try {
        await transporter.sendMail(mail);
        console.log("Email sent successfully");
    } catch (error) {
        console.error("Email Service Failed");
        console.error(error);

        throw new ApiError(400, "Failed to send email", error);
    }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
    return {
        body: {
            name: username,

            intro: "Welcome to our platform! We're excited to have you onboard.",

            action: {
                instructions:
                    "To verify your email address, please click the button below:",

                button: {
                    color: "#22BC66",
                    text: "Verify Email",
                    link: verificationUrl,
                },
            },

            outro: "If you did not create this account, you can safely ignore this email.\n\nNeed help? Just reply to this email — we'd be happy to assist you.",
        },
    };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
    return {
        body: {
            name: username,

            intro: "We received a request to reset your password.",

            action: {
                instructions: "Click the button below to reset your password:",

                button: {
                    color: "#DC4D2F",
                    text: "Reset Password",
                    link: passwordResetUrl,
                },
            },

            outro: "This password reset link will expire shortly for security reasons.\n\nIf you did not request a password reset, you can safely ignore this email.",
        },
    };
};

export {
    sendEmail,
    emailVerificationMailgenContent,
    forgotPasswordMailgenContent,
};
