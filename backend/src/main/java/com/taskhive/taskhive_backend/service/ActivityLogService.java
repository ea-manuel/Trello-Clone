package com.taskhive.taskhive_backend.service;

import com.taskhive.taskhive_backend.model.ActivityLog;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.repository.ActivityLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ActivityLogService {

    @Autowired
    private ActivityLogRepository activityLogRepository;

    // ✅ Use User object directly instead of fetching by ID
    public void logActivity(User user, String action, String location) {
        ActivityLog log = new ActivityLog();
        log.setUser(user);
        log.setAction(action);
        log.setLocation(location);
        log.setTimestamp(LocalDateTime.now());

        activityLogRepository.save(log);
    }

    // ✅ Optional: retrieve all logs
    public List<ActivityLog> getAllLogs() {
        return activityLogRepository.findAll();
    }
}
