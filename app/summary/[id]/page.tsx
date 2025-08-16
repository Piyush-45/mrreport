
import Summary from '@/components/common/Summary'
import ReportTable from '@/components/Reports/ReportTable'
import { getSummaryById } from '@/lib/singleSummary'

import { notFound } from 'next/navigation'

interface PageProps {
    params: {
        id: string
    }
}

const Page = async ({ params }: PageProps) => {
    const summary = await getSummaryById(params.id)

    console.log(summary)
    if (!summary) {
        return notFound() // If summary not found, show 404 page
    }

    return (
        <div className="w-full max-w-4xl mx-auto">
            <ReportTable markdown={summary.summaryText} />
            {/* <h1>summary detail</h1> */}
        </div>
    )
}

export default Page
