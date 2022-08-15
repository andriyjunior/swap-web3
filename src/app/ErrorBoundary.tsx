import React from 'react'
// import * as Sentry from '@sentry/browser';
import Catch from './functionalErrorBoundary'
// import { ReportFeedback } from 'pages/ReportFeedback';

type Props = {
  children: React.ReactNode
}

// const enrichError = (error: any | Error): any | Error => {
//   if (error instanceof Error) {
//     return error;
//   }
//   if (!error.message) {
//     error.message = 'Not Error Exception';
//     try {
//       error.stack = JSON.stringify(error);
//     } catch (_e) {
//       console.error(_e);
//     }
//   }
//   return error;
// };

export const ErrorBoundary = Catch(
  (props: Props, error?: Error, errorInfo?: React.ErrorInfo) => {
    if (!error) {
      return props.children
    }
    if (!errorInfo) {
      return <span>We've got an error... wait for a component stack</span>
    }

    // const eventId: string = Sentry.captureException(enrichError(error), s =>
    //   s.setExtras(errorInfo as any)
    // );

    // const reportFeedbackHandler = () => Sentry.showReportDialog({ eventId });

    return <span>We've got an error... wait for a component stack</span>
    // return <ReportFeedback reportFeedback={reportFeedbackHandler} />;
  }
)
