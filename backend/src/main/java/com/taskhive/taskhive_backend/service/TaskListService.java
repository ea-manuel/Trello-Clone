package com.taskhive.taskhive_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.TaskList;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.repository.TaskListRepository;

@Service
public class TaskListService {

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public TaskList createTaskList(String title, Board board, User user) {
        TaskList list = new TaskList();
        list.setTitle(title);
        list.setBoard(board);
        TaskList savedList = taskListRepository.save(list);

        // Log the activity
        String location = "Board: " + board.getTitle() + " → List: " + title;
        activityLogService.logActivity(user, "created list", location);

        return savedList;
    }

    public List<TaskList> getListsByBoard(Board board) {
        return taskListRepository.findByBoard(board);
    }
}
