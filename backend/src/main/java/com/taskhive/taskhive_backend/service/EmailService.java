package com.taskhive.taskhive_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendInviteEmail(String to, String inviter, String workspaceName) {
        // Generate a unique invite link (for now, use workspace and email as params)
        String acceptUrl = String.format("https://taskhive.app/accept-invite?workspace=%s&email=%s",
                workspaceName.replaceAll(" ", "%20"),
                to.replaceAll("@", "%40"));
        String emailBody = "<p>" + inviter + " has invited you to collaborate on the '<b>" + workspaceName + "</b>' workspace in TaskHive.</p>"
                + "<p><a href='" + acceptUrl + "' style='background:#0B1F3A;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;display:inline-block;'>Click here to accept</a></p>"
                + "<p>If you did not expect this, you can ignore this email.</p>";
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("You're invited to join a TaskHive workspace!");
            helper.setText(emailBody, true); // true = isHtml
            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send invite email", e);
        }
    }
} 