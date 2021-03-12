<?php

namespace App\Http\Controllers;

use App\Exports\PatientExport;
use App\Exports\PrenatalRecordExport;
use App\Exports\RegularRecordExport;

class ExportController extends Controller
{
    public function patients()
    {
        return new PatientExport();
    }

    public function regularRecords()
    {
        return new RegularRecordExport();
    }

    public function prenatalRecords()
    {
        return new PrenatalRecordExport();
    }
}
