import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all projects
export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST create or update a project (single project)
export async function POST(request: Request) {
  const project = await request.json();
  
  if (!project.id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('projects')
    .upsert({
      id: project.id,
      name: project.name,
      blocks: project.blocks,
      collapsed_ids: project.collapsedIds,
      ghost_notes: project.ghostNotes,
      last_ghost_block_count: project.lastGhostBlockCount,
      last_ghost_timestamp: project.lastGhostTimestamp,
      last_ghost_texts: project.lastGhostTexts,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

// DELETE a project
export async function DELETE(request: Request) {
  const { id } = await request.json();
  
  if (!id) {
    return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
