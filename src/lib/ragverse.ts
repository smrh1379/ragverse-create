// Core RAGverse functionality
import { supabase } from "@/integrations/supabase/client";

export interface Universe {
  id: string;
  name: string;
  description: string;
  owner_id: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DataChunk {
  id: string;
  universe_id: string;
  content: string;
  metadata: {
    file_name: string;
    chunk_index: number;
    file_size: number;
    upload_date: string;
  };
  embedding_id?: string;
}

export interface QueryLog {
  id: string;
  universe_id: string;
  user_id: string;
  query_text: string;
  response_text: string;
  sources: string[];
  timestamp: string;
}

export interface Collaborator {
  universe_id: string;
  user_id: string;
  role: 'owner' | 'editor' | 'viewer';
  invited_at: string;
}

// File processing utilities
export const SUPPORTED_FILE_TYPES = {
  'application/pdf': '.pdf',
  'text/plain': '.txt',
  'text/markdown': '.md',
  'text/csv': '.csv',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx'
};

export const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
export const MAX_TOTAL_SIZE = 500 * 1024 * 1024; // 500MB per user

export class RAGService {
  private static instance: RAGService;
  
  static getInstance(): RAGService {
    if (!RAGService.instance) {
      RAGService.instance = new RAGService();
    }
    return RAGService.instance;
  }

  async createUniverse(name: string, description: string, userId: string): Promise<Universe> {
    const { data, error } = await supabase
      .from('universes')
      .insert({
        name,
        description,
        owner_id: userId,
        is_public: false
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getUserUniverses(userId: string): Promise<Universe[]> {
    const { data, error } = await supabase
      .from('universes')
      .select('*')
      .or(`owner_id.eq.${userId},collaborators.user_id.eq.${userId}`)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadFile(file: File, universeId: string): Promise<string> {
    if (!SUPPORTED_FILE_TYPES[file.type as keyof typeof SUPPORTED_FILE_TYPES]) {
      throw new Error('Unsupported file type');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File too large');
    }

    const fileName = `${universeId}/${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('universe-files')
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  }

  async processFile(filePath: string, universeId: string): Promise<DataChunk[]> {
    // This would typically call your backend API to process the file
    // For now, we'll simulate the chunking process
    const response = await fetch('/api/process-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, universeId })
    });

    if (!response.ok) {
      throw new Error('Failed to process file');
    }

    return response.json();
  }

  async queryUniverse(universeId: string, query: string, userId: string): Promise<{
    response: string;
    sources: string[];
  }> {
    const response = await fetch('/api/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universeId, query, userId })
    });

    if (!response.ok) {
      throw new Error('Query failed');
    }

    const result = await response.json();
    
    // Log the query
    await supabase.from('query_logs').insert({
      universe_id: universeId,
      user_id: userId,
      query_text: query,
      response_text: result.response,
      sources: result.sources
    });

    return result;
  }

  async inviteCollaborator(universeId: string, email: string, role: 'editor' | 'viewer'): Promise<void> {
    const response = await fetch('/api/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ universeId, email, role })
    });

    if (!response.ok) {
      throw new Error('Failed to send invitation');
    }
  }

  async getUniverseCollaborators(universeId: string): Promise<Collaborator[]> {
    const { data, error } = await supabase
      .from('collaborators')
      .select(`
        *,
        user:users(id, email, username)
      `)
      .eq('universe_id', universeId);

    if (error) throw error;
    return data || [];
  }
}