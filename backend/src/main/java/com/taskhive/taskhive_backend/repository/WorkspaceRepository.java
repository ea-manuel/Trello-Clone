/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.taskhive.taskhive_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.taskhive.taskhive_backend.model.User;
import com.taskhive.taskhive_backend.model.Workspace;

public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {
    List<Workspace> findByUser(User user);
}
