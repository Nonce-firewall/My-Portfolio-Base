/*
  # Add WhatsApp URL to team members

  1. Schema Changes
    - Add `whatsapp_url` column to `team_members` table
    - Column type: text (nullable)
    - Allows team members to have optional WhatsApp contact links

  2. Security
    - No RLS changes needed (inherits existing policies)
    - Column is optional and follows same access patterns as other social URLs
*/

-- Add WhatsApp URL column to team_members table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'team_members' AND column_name = 'whatsapp_url'
  ) THEN
    ALTER TABLE team_members ADD COLUMN whatsapp_url text;
  END IF;
END $$;