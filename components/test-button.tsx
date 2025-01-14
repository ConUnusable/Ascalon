import React from 'react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

export default function TestButton() {
    function testFunction() {
        axios.post('/api/delete-activity', {activityId: 1})
    }

    return (
        <>
            <Button onClick={testFunction} className="border-green-600 border-2 bg-transparent text-green-600 hover:bg-green-400 hover:bg-opacity-50 hover:border-opacity-0">
                Test Button
            </Button>
        </>
    );
}
