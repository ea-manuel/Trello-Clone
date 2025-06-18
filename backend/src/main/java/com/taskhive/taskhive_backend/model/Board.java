package com.taskhive.taskhive_backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "boards")
public class Board {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    // Many boards belong to one user
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Many boards belong to one workspace
    @ManyToOne
    @JoinColumn(name = "workspace_id")
    private Workspace workspace;

    // One board can have many lists
    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<TaskList> lists = new ArrayList<>();

    // Getters and setters (can be generated)
public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Workspace getWorkspace() { return workspace; }
    public void setWorkspace(Workspace workspace) { this.workspace = workspace; }

    public List<TaskList> getLists() { return lists; }
    public void setLists(List<TaskList> lists) { this.lists = lists; }
}




