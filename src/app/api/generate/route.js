export async function POST(request) {
  try {
    const { topic } = await request.json();  // Only get needed field

    const backendResponse = await fetch('${process.env.NEXT_PUBLIC_API_BASE_URL}/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      throw new Error(errorData.error || 'Backend request failed');
    }

    const data = await backendResponse.json();
    
    return Response.json({
      research_summary: data.research_summary,
      linkedin_post: data.linkedin_post,
      x_post: data.x_post
    });
    
  } catch (error) {
    console.error('API Error:', error.message);
    return Response.json(
      { message: error.message || 'Failed to generate posts' },
      { status: 500 }
    );
  }
}