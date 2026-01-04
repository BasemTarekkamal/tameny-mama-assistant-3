export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      appointments: {
        Row: {
          created_at: string | null
          doctor_id: string | null
          extra_fee: number | null
          id: string
          is_urgent: boolean | null
          patient_id: string | null
          payment_method: string | null
          scheduled_at: string | null
          status: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          doctor_id?: string | null
          extra_fee?: number | null
          id?: string
          is_urgent?: boolean | null
          patient_id?: string | null
          payment_method?: string | null
          scheduled_at?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          doctor_id?: string | null
          extra_fee?: number | null
          id?: string
          is_urgent?: boolean | null
          patient_id?: string | null
          payment_method?: string | null
          scheduled_at?: string | null
          status?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      assistants: {
        Row: {
          assistant_id: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          assistant_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          assistant_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string
          session_id: string | null
          source_chunks: Json | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role: string
          session_id?: string | null
          source_chunks?: Json | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string
          session_id?: string | null
          source_chunks?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string | null
          id: string
          initial_prompt: string | null
          name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          initial_prompt?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          initial_prompt?: string | null
          name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      children: {
        Row: {
          allergies: string[] | null
          avatar_url: string | null
          blood_type: string | null
          created_at: string | null
          date_of_birth: string | null
          gender: string | null
          id: string
          medical_notes: string | null
          name: string
          parent_id: string
          updated_at: string | null
        }
        Insert: {
          allergies?: string[] | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          medical_notes?: string | null
          name: string
          parent_id: string
          updated_at?: string | null
        }
        Update: {
          allergies?: string[] | null
          avatar_url?: string | null
          blood_type?: string | null
          created_at?: string | null
          date_of_birth?: string | null
          gender?: string | null
          id?: string
          medical_notes?: string | null
          name?: string
          parent_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          company: string | null
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          message: string
          mobile_number: string
          subject: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          message: string
          mobile_number: string
          subject: string
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          message?: string
          mobile_number?: string
          subject?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string
          status: string | null
          thread_id: string
          whatsapp_number: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string
          status?: string | null
          thread_id: string
          whatsapp_number: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string
          status?: string | null
          thread_id?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      document_chunks: {
        Row: {
          chunk_index: number | null
          chunk_text: string
          created_at: string | null
          document_id: string | null
          embedding: string | null
          file_id: string | null
          id: string
          metadata: Json | null
        }
        Insert: {
          chunk_index?: number | null
          chunk_text: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          file_id?: string | null
          id?: string
          metadata?: Json | null
        }
        Update: {
          chunk_index?: number | null
          chunk_text?: string
          created_at?: string | null
          document_id?: string | null
          embedding?: string | null
          file_id?: string | null
          id?: string
          metadata?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "document_chunks_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          content: string | null
          created_at: string | null
          error_message: string | null
          file_path: string | null
          id: string
          metadata: Json | null
          name: string
          session_id: string | null
          status: Database["public"]["Enums"]["processing_status"] | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at: string | null
          url: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          name: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["processing_status"] | null
          type: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          error_message?: string | null
          file_path?: string | null
          id?: string
          metadata?: Json | null
          name?: string
          session_id?: string | null
          status?: Database["public"]["Enums"]["processing_status"] | null
          type?: Database["public"]["Enums"]["document_type"]
          updated_at?: string | null
          url?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      files: {
        Row: {
          ai_response: string | null
          created_at: string | null
          id: number
          mime_type: string | null
          name: string | null
          path: string | null
          size: number | null
        }
        Insert: {
          ai_response?: string | null
          created_at?: string | null
          id?: number
          mime_type?: string | null
          name?: string | null
          path?: string | null
          size?: number | null
        }
        Update: {
          ai_response?: string | null
          created_at?: string | null
          id?: number
          mime_type?: string | null
          name?: string | null
          path?: string | null
          size?: number | null
        }
        Relationships: []
      }
      generations: {
        Row: {
          created_at: string
          id: number
          image_url: string
          prompt: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_url: string
          prompt: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          image_url?: string
          prompt?: string
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          role: string | null
          tenant_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          role?: string | null
          tenant_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      patients: {
        Row: {
          created_at: string | null
          full_name: string
          id: string
          medical_history_summary: Json | null
          phone: string | null
          tenant_id: string | null
        }
        Insert: {
          created_at?: string | null
          full_name: string
          id?: string
          medical_history_summary?: Json | null
          phone?: string | null
          tenant_id?: string | null
        }
        Update: {
          created_at?: string | null
          full_name?: string
          id?: string
          medical_history_summary?: Json | null
          phone?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "patients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          tenant_id: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          tenant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          created_at: string | null
          id: string
          name: string
          plan: string | null
          slug: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          slug: string
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string
        }
        Relationships: []
      }
      threads: {
        Row: {
          Agent_Response: string | null
          created_at: string | null
          id: number
          location: string | null
          message: string | null
          metadata: Json | null
          sender_phone_number: string | null
          thread_id: string | null
          TTS_Voice_Messages: string | null
          User_NAme: string | null
        }
        Insert: {
          Agent_Response?: string | null
          created_at?: string | null
          id?: never
          location?: string | null
          message?: string | null
          metadata?: Json | null
          sender_phone_number?: string | null
          thread_id?: string | null
          TTS_Voice_Messages?: string | null
          User_NAme?: string | null
        }
        Update: {
          Agent_Response?: string | null
          created_at?: string | null
          id?: never
          location?: string | null
          message?: string | null
          metadata?: Json | null
          sender_phone_number?: string | null
          thread_id?: string | null
          TTS_Voice_Messages?: string | null
          User_NAme?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_image_record: {
        Args: { image_url: string; prompt: string; user_id: string }
        Returns: Json
      }
      match_document_chunks: {
        Args: {
          match_count: number
          match_threshold: number
          p_file_id: number
          query_embedding: string
        }
        Returns: {
          chunk_text: string
          id: number
          similarity: number
        }[]
      }
      search_similar_chunks: {
        Args: {
          match_count?: number
          query_embedding: string
          session_id_param: string
          similarity_threshold?: number
        }
        Returns: {
          chunk_id: string
          chunk_text: string
          document_id: string
          document_name: string
          similarity: number
        }[]
      }
    }
    Enums: {
      document_type: "file" | "url" | "text"
      processing_status: "pending" | "processing" | "completed" | "error"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      document_type: ["file", "url", "text"],
      processing_status: ["pending", "processing", "completed", "error"],
    },
  },
} as const
