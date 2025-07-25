package com.taskhive.taskhive_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.WorkspaceRepository;
import com.taskhive.taskhive_backend.service.BoardService;
import com.taskhive.taskhive_backend.service.UserService;
import java.security.Principal;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    @Autowired
    private BoardService boardService;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<Board> createBoard(@RequestBody Map<String, String> request) {
        Long workspaceId = Long.parseLong(request.get("workspaceId"));
        String title = request.get("title");

        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        Board board = new Board();
        board.setTitle(title);
        board.setWorkspace(workspace);
        // (Reverted) Do not set user field

        return ResponseEntity.ok(boardService.createBoard(board));
    }

    @GetMapping("/{workspaceId}")
    public ResponseEntity<List<Board>> getBoardsByWorkspace(@PathVariable Long workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new RuntimeException("Workspace not found"));

        return ResponseEntity.ok(boardService.getBoardsByWorkspace(workspace));
    }
}
