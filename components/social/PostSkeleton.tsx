"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function PostSkeleton() {
  return (
    <Card className="w-full animate-pulse">
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <div className="flex items-center space-x-3 w-full">
          {/* Avatar skeleton */}
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          
          <div className="flex-1 space-y-2">
            {/* Username skeleton */}
            <div className="h-4 bg-gray-200 rounded w-24"></div>
            {/* Timestamp skeleton */}
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          
          {/* Menu button skeleton */}
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Text content skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Image skeleton */}
        <div className="w-full h-64 bg-gray-200 rounded-lg"></div>
        
        {/* Action buttons skeleton */}
        <div className="flex justify-between items-center pt-3">
          <div className="flex space-x-4">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
        
        {/* Likes count skeleton */}
        <div className="h-4 bg-gray-200 rounded w-20"></div>
      </CardContent>
    </Card>
  )
}