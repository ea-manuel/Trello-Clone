package com.taskhive.taskhive_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.BoardRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    @Autowired
    private ActivityLogService activityLogService;

    public Board createBoard(Board board) {
        Board savedBoard = boardRepository.save(board);

        // Prefer the actor explicitly set on the board (from controller).
        // Fallback to the workspace owner if it's null.
        User actor =
            board.getUser() != null
                ? board.getUser()
                : (board.getWorkspace() != null ? board.getWorkspace().getOwner() : null);

        if (actor != null) {
            activityLogService.logActivity(
                actor,
                "Created board",
                "Board: " + savedBoard.getTitle()
            );
        }

        return savedBoard;
    }

    public List<Board> getBoardsByWorkspace(Workspace workspace) {
        return boardRepository.findByWorkspace(workspace);
    }
}
