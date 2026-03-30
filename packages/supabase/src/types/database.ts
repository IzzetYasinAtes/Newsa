// Bu dosya supabase gen types komutu ile otomatik oluşturulacak
// Şimdilik placeholder olarak bırakıyoruz

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string
          display_name: string | null
          avatar_url: string | null
          bio: string | null
          role: 'admin' | 'editor' | 'author' | 'viewer'
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      tags: {
        Row: {
          id: string
          name: string
          slug: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['tags']['Insert']>
      }
      articles: {
        Row: {
          id: string
          title: string
          slug: string
          summary: string | null
          content: Record<string, unknown> | null
          content_html: string | null
          cover_image_id: string | null
          cover_image_alt: string | null
          category_id: string
          author_id: string
          status: 'draft' | 'review' | 'published' | 'archived'
          published_at: string | null
          archived_at: string | null
          is_featured: boolean
          is_headline: boolean
          is_breaking: boolean
          featured_order: number | null
          breaking_expires_at: string | null
          seo_title: string | null
          seo_description: string | null
          seo_keywords: string[] | null
          canonical_url: string | null
          view_count: number
          share_count: number
          source_name: string | null
          source_url: string | null
          editor_id: string | null
          editor_notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'view_count' | 'share_count' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
      }
      media: {
        Row: {
          id: string
          file_name: string
          original_name: string
          file_path: string
          file_url: string
          file_size: number
          mime_type: string
          width: number | null
          height: number | null
          alt_text: string | null
          caption: string | null
          uploaded_by: string
          folder: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['media']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['media']['Insert']>
      }
    }
    Functions: {
      generate_slug: {
        Args: { title: string }
        Returns: string
      }
      increment_view_count: {
        Args: { article_id: string }
        Returns: void
      }
    }
  }
}
