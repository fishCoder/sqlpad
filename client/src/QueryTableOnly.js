import PropTypes from 'prop-types';
import React, { useState, useEffect } from 'react';
import ExportButton from './common/ExportButton.js';
import IncompleteDataNotification from './common/IncompleteDataNotification';
import QueryResultDataTable from './common/QueryResultDataTable.js';
import fetchJson from './utilities/fetch-json.js';

function QueryTableOnly({ queryId }) {
  const [isRunning, setIsRunning] = useState(false);
  const [runQueryStartTime, setRunQueryStartTime] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [query, setQuery] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const runQuery = async queryId => {
    setIsRunning(true);
    setRunQueryStartTime(new Date());

    const queryJson = await fetchJson('GET', '/api/queries/' + queryId);

    if (queryJson.error) {
      console.error(queryJson.error);
    }
    setQuery(queryJson.query);

    const queryResultJson = await fetchJson(
      'GET',
      '/api/query-result/' + queryId
    );

    setIsRunning(false);
    setQueryError(queryResultJson.error);
    setQueryResult(queryResultJson.queryResult);
  };

  useEffect(() => {
    document.title = 'SQLPad';
    runQuery(queryId);
  }, [queryId]);

  const incomplete = queryResult ? queryResult.incomplete : false;
  const cacheKey = queryResult ? queryResult.cacheKey : null;

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        flexDirection: 'column',
        padding: '16px'
      }}
    >
      <div style={{ height: '50px' }}>
        <span style={{ fontSize: '2rem' }}>{query ? query.name : ''}</span>
        <div style={{ float: 'right' }}>
          {incomplete && <IncompleteDataNotification />}
          <ExportButton cacheKey={cacheKey} />
        </div>
      </div>
      <div style={{ display: 'flex', flexGrow: 1, height: '100%' }}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            border: '1px solid #CCC'
          }}
        >
          <QueryResultDataTable
            isRunning={isRunning}
            runQueryStartTime={runQueryStartTime}
            queryResult={queryResult}
            queryError={queryError}
          />
        </div>
      </div>
    </div>
  );
}

QueryTableOnly.propTypes = {
  queryId: PropTypes.string.isRequired
};

export default QueryTableOnly;
