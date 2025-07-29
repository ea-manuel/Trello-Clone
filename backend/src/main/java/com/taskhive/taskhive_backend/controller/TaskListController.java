package com.taskhive.taskhive_backend.controller;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.TaskList;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.payload.TasklistRequest;
import com.taskhive.taskhive_backend.repository.BoardRepository;
import com.taskhive.taskhive_backend.repository.TaskListRepository;
import com.taskhive.taskhive_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping("/api/tasklists")
public class TaskListController {

    @Autowired
    private TaskListRepository taskListRepository;

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public ResponseEntity<?> createTaskList(@RequestBody TasklistRequest request, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + email));

            Board board = boardRepository.findById(request.getBoardId())
                    .orElseThrow(() -> new RuntimeException("Board not found with ID: " + request.getBoardId()));

            // ✅ Check if the user is a member of the workspace
            if (!board.getWorkspace().getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You are not a member of this workspace");
            }

            TaskList taskList = new TaskList();
            taskList.setTitle(request.getTitle());
            taskList.setBoard(board);

            TaskList savedList = taskListRepository.save(taskList);
            return ResponseEntity.ok(savedList);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error creating task list: " + e.getMessage());
        }
    }

    @GetMapping("/board/{boardId}")
    public ResponseEntity<?> getListsByBoard(@PathVariable Long boardId, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found"));

            Board board = boardRepository.findById(boardId)
                    .orElseThrow(() -> new RuntimeException("Board not found"));

            // ✅ Check if the user is a member of the workspace
            if (!board.getWorkspace().getUsers().contains(user)) {
                return ResponseEntity.status(403).body("Forbidden: You are not a member of this workspace");
            }

            return ResponseEntity.ok(taskListRepository.findByBoard(board));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error retrieving lists: " + e.getMessage());
        }
    }
}
