package com.taskhive.taskhive_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskhive.taskhive_backend.model.Board;
import com.taskhive.taskhive_backend.model.Workspace;

public interface BoardRepository extends JpaRepository<Board, Long> {
    List<Board> findByWorkspace(Workspace workspace);
}
// This interface extends JpaRepository to provide CRUD operations for Board entities.