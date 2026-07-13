-- ============================================================================
-- 9. SUPABASE STORAGE (Section 11.2)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES 
('reports', 'reports', false, 52428800, ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
('incident-attachments', 'incident-attachments', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']),
('ai-exports', 'ai-exports', false, 10485760, ARRAY['application/pdf', 'text/plain']),
('avatars', 'avatars', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp']),
('system-assets', 'system-assets', true, 5242880, ARRAY['image/svg+xml', 'image/png', 'application/json']);

CREATE POLICY "reports_read_own_stadium" ON storage.objects FOR SELECT USING (bucket_id = 'reports' AND (storage.foldername(name))[1] = get_user_stadium_id()::text);
CREATE POLICY "reports_insert_service" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reports' AND auth.role() = 'service_role');
CREATE POLICY "attachments_read_own_stadium" ON storage.objects FOR SELECT USING (bucket_id = 'incident-attachments' AND (storage.foldername(name))[1] = get_user_stadium_id()::text);
