package com.taskhive.taskhive_backend.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    public String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    @Transactional
    public void sendOtpToEmail(String email) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            String otp = generateOtp();
            user.setOtp(otp);
            user.setOtpExpiry(LocalDateTime.now().plusMinutes(5)); // OTP valid for 5 mins
            userRepository.save(user);

            String subject = "Your TaskHive OTP Code";
            String message = "Your OTP code is: " + otp + "\nIt expires in 5 minutes.";
            emailService.sendReminderEmail(email, subject, message);
        } else {
            throw new RuntimeException("User not found with email: " + email);
        }
    }

    @Transactional
    public boolean verifyOtp(String email, String otp) {
        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (user.getOtp() != null &&
                user.getOtpExpiry() != null &&
                otp.equals(user.getOtp()) &&
                LocalDateTime.now().isBefore(user.getOtpExpiry())) {

                user.setVerified(true);
                user.setOtp(null);
                user.setOtpExpiry(null);
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }
}
