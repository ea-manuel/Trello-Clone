package com.taskhive.taskhive_backend.payload;

public class WorkspaceRequest {
    private String name;

    public WorkspaceRequest() {}

    public WorkspaceRequest(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Object getVisibility() {
        // TODO Auto-generated method stub
        throw new UnsupportedOperationException("Unimplemented method 'getVisibility'");
    }
}
