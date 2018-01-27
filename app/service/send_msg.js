/**
 * 发送消息，支持邮件和微信
 */

const nodemailer = require('nodemailer');

module.exports = (app) => {
  const transporter = nodemailer.createTransport(app.config.transporter);
  class SendMsgService extends app.Service {
    sengWeixin() {
      // TODO
    }
    sendEmail(to, subject, html) {
      const { auth, appName } = this.config.transporter;
      const mailOptions = {
        from: `${appName} <${auth.user}>`,
        to,
        subject,
        html
      };
      return transporter.sendMail(mailOptions).catch((error) => {
        this.ctx.logger.info('Message %s sent error: %s', error);
        return error;
      });
    }
    * send(to, subject, html) {
      return yield [this.sendEmail(to, subject, html)];
    }
  }
  return SendMsgService;
};
