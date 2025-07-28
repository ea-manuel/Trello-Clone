package com.taskhive.taskhive_backend.dto;

public class BoardDTO {
    private Long id;
    private String title;
    private Long workspaceId;

    public BoardDTO(Long id, String title, Long workspaceId) {
        this.id = id;
        this.title = title;
        this.workspaceId = workspaceId;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public Long getWorkspaceId() { return workspaceId; }
    public void setWorkspaceId(Long workspaceId) { this.workspaceId = workspaceId; }
}
