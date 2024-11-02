// Helper function to determine the resource type based on MIME type
export const getResourceType = (mimetype: string) => {
  if (mimetype.startsWith('image/')) {
    return 'image'
  } else if (mimetype.startsWith('video/')) {
    return 'video'
  } else if (mimetype.startsWith('audio/')) {
    return 'raw' // For audio files, you can use 'raw' or 'video' based on your needs
  } else if (
    [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ].includes(mimetype)
  ) {
    return 'raw' // Use raw for documents
  }
  return 'raw' // Default to raw for any other types
}
