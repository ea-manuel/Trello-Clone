package com.taskhive.taskhive_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.TaskList;

public interface TaskListRepository extends JpaRepository<TaskList, Long> {
    List<TaskList> findByBoard(Board board);
}
