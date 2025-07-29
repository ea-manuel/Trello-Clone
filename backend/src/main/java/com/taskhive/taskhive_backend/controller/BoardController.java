package com.taskhive.taskhive_backend.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.WorkspaceRepository;
import com.taskhive.taskhive_backend.security.CustomUserDetails;
import com.taskhive.taskhive_backend.service.BoardService;
import com.taskhive.taskhive_backend.service.UserService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private static final Logger logger = LoggerFactory.getLogger(BoardController.class);

    @Autowired
    private BoardService boardService;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private UserService userService;

    @PostMapping("")
    public ResponseEntity<?> createBoard(@RequestBody Map<String, Object> request, Authentication authentication) {
        try {
            logger.info("Received createBoard request: {}", request);

            if (!request.containsKey("workspaceId") || !request.containsKey("title")) {
                return ResponseEntity.badRequest().body("Missing required fields: 'workspaceId' and 'title'");
            }

            Long workspaceId = Long.parseLong(request.get("workspaceId").toString());
            String title = request.get("title").toString();

            String email = extractEmailFromPrincipal(authentication);
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));

           Workspace workspace = workspaceRepository.findById(workspaceId)
               .filter(ws -> ws.getUsers().contains(user))
              .orElseThrow(() -> new RuntimeException("Workspace not found or user is not a collaborator"));

            // Optional: prevent duplicate board title within same workspace
            List<Board> existingBoards = boardService.getBoardsByWorkspace(workspace);
            boolean alreadyExists = existingBoards.stream().anyMatch(b -> b.getTitle().equalsIgnoreCase(title));
            if (alreadyExists) {
                return ResponseEntity.badRequest().body("A board with this title already exists in the workspace.");
            }

            Board board = new Board();
            board.setTitle(title);
            board.setWorkspace(workspace);
            board.setUser(user);

            Board savedBoard = boardService.createBoard(board);
            logger.info("Board created successfully with ID: {}", savedBoard.getId());

            return ResponseEntity.ok(savedBoard);
        } catch (NumberFormatException e) {
            logger.error("Invalid workspace ID format", e);
            return ResponseEntity.badRequest().body("Invalid workspace ID format. Must be a number.");
        } catch (RuntimeException re) {
            logger.warn("Validation error: {}", re.getMessage());
            return ResponseEntity.badRequest().body(re.getMessage());
        } catch (Exception ex) {
            logger.error("Error creating board: ", ex);
            return ResponseEntity.status(500).body("Internal server error: " + ex.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBoardsByWorkspace(@PathVariable("id") Long id, Authentication authentication) {
        try {
            String email = extractEmailFromPrincipal(authentication);
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Authenticated user not found in database"));

           Workspace workspace = workspaceRepository.findById(id)
        .filter(ws -> ws.getUsers().contains(user))
        .orElseThrow(() -> new RuntimeException("Workspace not found or user is not a collaborator"));
            

            List<Board> boards = boardService.getBoardsByWorkspace(workspace);
            return ResponseEntity.ok(boards);
        } catch (RuntimeException re) {
            return ResponseEntity.badRequest().body(re.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Internal server error: " + ex.getMessage());
        }
    }

    private String extractEmailFromPrincipal(Authentication authentication) {
        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getUsername();
        } else if (principal instanceof org.springframework.security.core.userdetails.User springUser) {
            return springUser.getUsername();
        } else if (principal instanceof String username) {
            return username;
        } else {
            throw new RuntimeException("Unsupported principal type: " + principal.getClass());
        }
    }
}
