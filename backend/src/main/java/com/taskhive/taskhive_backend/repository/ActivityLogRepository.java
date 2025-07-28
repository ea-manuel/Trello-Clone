package com.taskhive.taskhive_backend.repository;

import com.taskhive.taskhive_backend.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {
}
