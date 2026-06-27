import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const ContentContext = createContext(null);

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/content");
      setContent(data);
      setError(null);
    } catch (e) {
      setError(e?.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  const saveContent = async (next) => {
    const { data } = await api.put("/admin/content", next);
    setContent(data);
    return data;
  };

  return (
    <ContentContext.Provider value={{ content, loading, error, fetchContent, saveContent, setContent }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
};
