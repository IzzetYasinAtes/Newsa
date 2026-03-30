import { NextResponse } from 'next/server'

interface Meta {
  total: number
  page: number
  per_page: number
  total_pages: number
}

interface SuccessResponse<T> {
  success: true
  data: T
  meta?: Meta
}

interface ErrorResponse {
  success: false
  error: {
    code: string
    message: string
  }
}

export function successResponse<T>(
  data: T,
  meta?: Meta,
  init?: ResponseInit,
): NextResponse<SuccessResponse<T>> {
  const body: SuccessResponse<T> = { success: true, data }
  if (meta) body.meta = meta
  return NextResponse.json(body, init)
}

export function errorResponse(
  code: string,
  message: string,
  status = 400,
): NextResponse<ErrorResponse> {
  return NextResponse.json(
    { success: false, error: { code, message } },
    { status },
  )
}
