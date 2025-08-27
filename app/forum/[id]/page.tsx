'use client'

import { useState } from 'react'
import { QuestionDetail } from '@/components/forum/QuestionDetail'
import { AnswerSection } from '@/components/forum/AnswerSection'
import { CommentSection } from '@/components/forum/CommentSection'
import { Comment } from '@/types/forum'

interface QuestionPageProps {
  params: {
    id: string
  }
}

export default function QuestionPage({ params }: QuestionPageProps) {
  const [comments, setComments] = useState<Comment[]>([])

  const handleAddComment = (comment: Comment) => {
    setComments(prev => [comment, ...prev])
    console.log('Novo comentário:', comment)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          {/* Detalhes da pergunta */}
          <QuestionDetail questionId={params.id} />

          {/* Seção de comentários da pergunta */}
          <div className="mt-8">
            <CommentSection 
              parentId={params.id}
              parentType="question"
              comments={comments}
              onAddComment={handleAddComment}
            />
          </div>

          {/* Seção de respostas */}
          <AnswerSection questionId={params.id} />
        </div>
      </div>
    </div>
  )
}
