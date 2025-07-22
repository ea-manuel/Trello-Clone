package com.taskhive.taskhive_backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    public void sendInviteEmail(String to, String inviter, String workspaceName) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject("You're invited to join a TaskHive workspace!");
        message.setText(String.format(
                "%s has invited you to collaborate on the '%s' workspace in TaskHive.\n\nClick here to accept: https://taskhive.app/invite?workspace=%s\n\nIf you did not expect this, you can ignore this email.",
                inviter, workspaceName, workspaceName.replaceAll(" ", "%20")));
        mailSender.send(message);
    }
} 