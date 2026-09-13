import ListUserSchedule from '#exam/queries/list_user_schedule'

export type UpcomingSchedule = {
  exams: {
    id: string
    title: string
    description: string | null
    startsAt: string
    endsAt: string
  }[]
}

export default class GetUpcomingSchedule {
  async handle({ userUuid }: { userUuid: string }): Promise<UpcomingSchedule> {
    const exams = await new ListUserSchedule().handle({ userUuid, limit: 5 })

    return {
      exams: exams.map((exam) => ({
        id: exam.uuid,
        title: exam.title,
        description: exam.description,
        startsAt: exam.startsAt.toISO()!,
        endsAt: exam.endsAt.toISO()!,
      })),
    }
  }
}
