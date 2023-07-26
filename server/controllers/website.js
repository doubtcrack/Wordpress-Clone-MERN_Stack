import Website from "../models/website";
const nodemailer = require("nodemailer");

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMPT_HOST,
  port: process.env.SMPT_PORT,
  service: process.env.SMPT_SERVICE,
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

export const contact = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    // prepare email
    const emailData = {
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_FROM,
      subject: "Email received from contact form",
      html: `
      <h3>Contact form message</h3>
      <p><u>Name</u></p>
      <p>${name}</p>
    <p><u>Email</u></p>
    <p>${email}</p>
    <p><u>Message</u></p>
    <p>${message}</p>
      `,
    };
    // send email
    try {
      const data = await transporter.sendMail(emailData);
      res.json({ ok: true });
    } catch (err) {
      console.log(err);
      res.json({ ok: false });
    }
  } catch (err) {
    console.log(err);
  }
};

// homepage, getHomepage
export const createPage = async (req, res) => {
  try {
    const { page } = req.body;
    const found = await Website.findOne({ page });

    if (found) {
      // update
      const updated = await Website.findOneAndUpdate({ page }, req.body, {
        new: true,
      });
      return res.json(updated);
    } else {
      // create
      const created = await new Website(req.body).save();
      return res.json(created);
    }
  } catch (err) {
    console.log(err);
  }
};

export const getPage = async (req, res) => {
  try {
    const { page } = req.params;
    const found = await Website.findOne({ page }).populate("fullWidthImage");
    return res.json(found);
  } catch (err) {
    console.log(err);
  }
};
