// Bu dosya supabase gen types komutu ile otomatik olusturulacak
// Simdilik placeholder olarak birakiyoruz

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
        Relationships: []
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
        Relationships: []
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
        Relationships: []
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
          deleted_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'view_count' | 'share_count' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['articles']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'articles_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'articles_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'articles_cover_image_id_fkey'
            columns: ['cover_image_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'articles_editor_id_fkey'
            columns: ['editor_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
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
        Relationships: [
          {
            foreignKeyName: 'media_uploaded_by_fkey'
            columns: ['uploaded_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      article_tags: {
        Row: {
          article_id: string
          tag_id: string
          created_at: string
        }
        Insert: {
          article_id: string
          tag_id: string
        }
        Update: {
          article_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'article_tags_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'article_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          }
        ]
      }
      article_revisions: {
        Row: {
          id: string
          article_id: string
          revision_number: number
          title: string
          content: Record<string, unknown> | null
          excerpt: string | null
          cover_image: string | null
          created_by: string | null
          created_at: string
          change_summary: string | null
        }
        Insert: Omit<Database['public']['Tables']['article_revisions']['Row'], 'id' | 'created_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['article_revisions']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'article_revisions_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'article_revisions_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      article_media: {
        Row: {
          article_id: string
          media_id: string
          sort_order: number
          created_at: string
        }
        Insert: {
          article_id: string
          media_id: string
          sort_order: number
        }
        Update: {
          article_id?: string
          media_id?: string
          sort_order?: number
        }
        Relationships: [
          {
            foreignKeyName: 'article_media_article_id_fkey'
            columns: ['article_id']
            isOneToOne: false
            referencedRelation: 'articles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'article_media_media_id_fkey'
            columns: ['media_id']
            isOneToOne: false
            referencedRelation: 'media'
            referencedColumns: ['id']
          }
        ]
      }
      ad_zones: {
        Row: {
          id: string
          name: string
          display_name: string
          description: string | null
          width: number | null
          height: number | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          display_name: string
          description?: string | null
          width?: number | null
          height?: number | null
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          display_name?: string
          description?: string | null
          width?: number | null
          height?: number | null
          is_active?: boolean
        }
        Relationships: []
      }
      ad_campaigns: {
        Row: {
          id: string
          name: string
          advertiser_name: string
          start_date: string
          end_date: string | null
          budget: number | null
          status: 'draft' | 'active' | 'paused' | 'completed'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          advertiser_name: string
          start_date: string
          end_date?: string | null
          budget?: number | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          created_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          advertiser_name?: string
          start_date?: string
          end_date?: string | null
          budget?: number | null
          status?: 'draft' | 'active' | 'paused' | 'completed'
          created_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ad_campaigns_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      ad_creatives: {
        Row: {
          id: string
          campaign_id: string
          zone_id: string
          title: string
          type: 'image' | 'html' | 'text'
          image_url: string | null
          html_content: string | null
          target_url: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          campaign_id: string
          zone_id: string
          title: string
          type?: 'image' | 'html' | 'text'
          image_url?: string | null
          html_content?: string | null
          target_url: string
          is_active?: boolean
        }
        Update: {
          id?: string
          campaign_id?: string
          zone_id?: string
          title?: string
          type?: 'image' | 'html' | 'text'
          image_url?: string | null
          html_content?: string | null
          target_url?: string
          is_active?: boolean
        }
        Relationships: [
          {
            foreignKeyName: 'ad_creatives_campaign_id_fkey'
            columns: ['campaign_id']
            isOneToOne: false
            referencedRelation: 'ad_campaigns'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ad_creatives_zone_id_fkey'
            columns: ['zone_id']
            isOneToOne: false
            referencedRelation: 'ad_zones'
            referencedColumns: ['id']
          }
        ]
      }
      pages: {
        Row: {
          id: string
          title: string
          slug: string
          content: Record<string, unknown> | null
          content_html: string | null
          status: 'draft' | 'published'
          seo_title: string | null
          seo_description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['pages']['Row'], 'id' | 'created_at' | 'updated_at'> & { id?: string }
        Update: Partial<Database['public']['Tables']['pages']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'pages_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      ad_impressions: {
        Row: {
          id: string
          creative_id: string
          zone_id: string
          event_type: 'impression' | 'click'
          user_agent: string | null
          ip_hash: string | null
          created_at: string
        }
        Insert: {
          id?: string
          creative_id: string
          zone_id: string
          event_type: 'impression' | 'click'
          user_agent?: string | null
          ip_hash?: string | null
        }
        Update: {
          id?: string
          creative_id?: string
          zone_id?: string
          event_type?: 'impression' | 'click'
          user_agent?: string | null
          ip_hash?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'ad_impressions_creative_id_fkey'
            columns: ['creative_id']
            isOneToOne: false
            referencedRelation: 'ad_creatives'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'ad_impressions_zone_id_fkey'
            columns: ['zone_id']
            isOneToOne: false
            referencedRelation: 'ad_zones'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
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
      get_next_revision_number: {
        Args: { p_article_id: string }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
