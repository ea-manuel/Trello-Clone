package com.taskhive.taskhive_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.Workspace;
import com.taskhive.taskhive_backend.repository.BoardRepository;

@Service
public class BoardService {

    @Autowired
    private BoardRepository boardRepository;

    public Board createBoard(Board board) {
        return boardRepository.save(board);
    }

    public List<Board> getBoardsByWorkspace(Workspace workspace) {
        return boardRepository.findByWorkspace(workspace);
    }
}
