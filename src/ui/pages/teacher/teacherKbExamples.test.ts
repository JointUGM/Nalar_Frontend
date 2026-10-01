import { describe, expect, it } from 'vitest'
import { kbTopicsBySchool } from './teacherKbExamples'
import { teacherSchools } from './teacherHomeExamples'

describe('knowledge base examples', () => {
  it('has an entry for every example school', () => {
    expect(Object.keys(kbTopicsBySchool).sort()).toEqual(teacherSchools.map((school) => school.name).sort())
  })
  it('gives empty topics no counts or file, and every other topic both', () => {
    const topics = Object.values(kbTopicsBySchool).flat()
    for (const topic of topics) {
      const hasContent = topic.concepts !== null && topic.misconceptions !== null && topic.file !== null
      expect(hasContent).toBe(topic.status !== 'empty')
      if (topic.status === 'empty') expect([topic.concepts, topic.misconceptions, topic.file]).toEqual([null, null, null])
    }
  })
  it('keeps topic ids unique', () => {
    const ids = Object.values(kbTopicsBySchool).flat().map((topic) => topic.id)
    expect(new Set(ids).size).toBe(ids.length)
  })
})
