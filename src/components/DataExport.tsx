import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Separator } from './ui/separator';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Download, FileText, Database, Archive, Calendar, Filter, CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ExportJob {
  id: string;
  name: string;
  format: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  createdAt: string;
  fileSize?: string;
  downloadUrl?: string;
}

export function DataExport() {
  const [selectedFloats, setSelectedFloats] = useState<string[]>(['2902734', '2902851']);
  const [exportFormat, setExportFormat] = useState('netcdf');
  const [dateRange, setDateRange] = useState('30d');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeQC, setIncludeQC] = useState(true);
  const [compressionLevel, setCompressionLevel] = useState('medium');
  const [customQuery, setCustomQuery] = useState('');
  const [exportDescription, setExportDescription] = useState('');

  // Mock export jobs
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([
    {
      id: 'exp-001',
      name: 'Arabian Sea Temperature Profiles',
      format: 'NetCDF',
      status: 'completed',
      progress: 100,
      createdAt: '2024-09-14 14:30',
      fileSize: '2.3 GB',
      downloadUrl: '#'
    },
    {
      id: 'exp-002',
      name: 'BGC Parameters - Last 30 days',
      format: 'CSV',
      status: 'processing',
      progress: 65,
      createdAt: '2024-09-15 09:15',
      fileSize: '1.1 GB (estimated)'
    },
    {
      id: 'exp-003',
      name: 'Float Trajectories - Indian Ocean',
      format: 'JSON',
      status: 'completed',
      progress: 100,
      createdAt: '2024-09-13 16:45',
      fileSize: '156 MB',
      downloadUrl: '#'
    },
    {
      id: 'exp-004',
      name: 'Salinity Anomalies',
      format: 'Parquet',
      status: 'failed',
      progress: 0,
      createdAt: '2024-09-12 11:20'
    }
  ]);

  const availableFloats = [
    { id: '2902734', name: 'Float 2902734 (Core)', type: 'core', profiles: 342 },
    { id: '2902851', name: 'Float 2902851 (BGC)', type: 'bgc', profiles: 298 },
    { id: '2903156', name: 'Float 2903156 (BGC)', type: 'bgc', profiles: 234 },
    { id: '2903201', name: 'Float 2903201 (Core)', type: 'core', profiles: 387 },
    { id: '2903287', name: 'Float 2903287 (BGC)', type: 'bgc', profiles: 523 }
  ];

  const handleFloatSelection = (floatId: string, checked: boolean) => {
    if (checked) {
      setSelectedFloats(prev => [...prev, floatId]);
    } else {
      setSelectedFloats(prev => prev.filter(id => id !== floatId));
    }
  };

  const handleExport = () => {
    // Mock export job creation
    const newJob: ExportJob = {
      id: `exp-${Date.now()}`,
      name: exportDescription || `Export ${selectedFloats.length} floats - ${exportFormat.toUpperCase()}`,
      format: exportFormat.toUpperCase(),
      status: 'pending',
      progress: 0,
      createdAt: new Date().toLocaleString()
    };

    setExportJobs(prev => [newJob, ...prev]);

    // Simulate processing
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing', progress: 25 }
          : job
      ));
      
      setTimeout(() => {
        setExportJobs(prev => prev.map(job => 
          job.id === newJob.id 
            ? { 
                ...job, 
                status: 'completed', 
                progress: 100, 
                fileSize: '1.8 GB',
                downloadUrl: '#'
              }
            : job
        ));
      }, 3000);
    }, 1000);
  };

  const getStatusIcon = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'processing':
        return <Clock className="h-4 w-4 text-blue-600 animate-spin" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: ExportJob['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTotalProfiles = () => {
    return selectedFloats.reduce((total, floatId) => {
      const float = availableFloats.find(f => f.id === floatId);
      return total + (float?.profiles || 0);
    }, 0);
  };

  const getEstimatedSize = () => {
    const baseSize = getTotalProfiles() * 0.5; // MB per profile
    const formatMultiplier = {
      'netcdf': 1.2,
      'csv': 0.8,
      'json': 1.5,
      'parquet': 0.6,
      'hdf5': 1.1
    };
    
    const size = baseSize * (formatMultiplier[exportFormat as keyof typeof formatMultiplier] || 1);
    return size > 1000 ? `${(size / 1000).toFixed(1)} GB` : `${Math.round(size)} MB`;
  };

  return (
    <div className="space-y-6">
      {/* Export Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-blue-600" />
                <span>Configure Data Export</span>
              </CardTitle>
              <CardDescription>
                Select data sources, format, and export parameters for ARGO data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Float Selection */}
              <div className="space-y-3">
                <h4 className="font-medium">Select ARGO Floats</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availableFloats.map(float => (
                    <div key={float.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        id={float.id}
                        checked={selectedFloats.includes(float.id)}
                        onCheckedChange={(checked) => handleFloatSelection(float.id, !!checked)}
                      />
                      <div className="flex-1">
                        <label htmlFor={float.id} className="font-medium text-sm cursor-pointer">
                          {float.name}
                        </label>
                        <div className="text-xs text-gray-600 flex items-center space-x-2">
                          <Badge variant={float.type === 'bgc' ? 'default' : 'secondary'} className="text-xs">
                            {float.type.toUpperCase()}
                          </Badge>
                          <span>{float.profiles} profiles</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Export Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Export Format</label>
                    <Select value={exportFormat} onValueChange={setExportFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="netcdf">NetCDF (.nc)</SelectItem>
                        <SelectItem value="csv">CSV (.csv)</SelectItem>
                        <SelectItem value="json">JSON (.json)</SelectItem>
                        <SelectItem value="parquet">Parquet (.parquet)</SelectItem>
                        <SelectItem value="hdf5">HDF5 (.h5)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select value={dateRange} onValueChange={setDateRange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">Last 7 Days</SelectItem>
                        <SelectItem value="30d">Last 30 Days</SelectItem>
                        <SelectItem value="90d">Last 90 Days</SelectItem>
                        <SelectItem value="1y">Last Year</SelectItem>
                        <SelectItem value="all">All Available Data</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Compression Level</label>
                    <Select value={compressionLevel} onValueChange={setCompressionLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None (Faster)</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High (Smaller)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Additional Options</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-metadata"
                          checked={includeMetadata}
                          onCheckedChange={setIncludeMetadata}
                        />
                        <label htmlFor="include-metadata" className="text-sm">
                          Include metadata
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="include-qc"
                          checked={includeQC}
                          onCheckedChange={setIncludeQC}
                        />
                        <label htmlFor="include-qc" className="text-sm">
                          Include quality control flags
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="text-sm font-medium">
                      Export Description
                    </label>
                    <Input
                      id="description"
                      placeholder="Optional description for your export..."
                      value={exportDescription}
                      onChange={(e) => setExportDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Custom Query */}
              <div className="space-y-2">
                <label htmlFor="custom-query" className="text-sm font-medium">
                  Custom SQL Query (Optional)
                </label>
                <Textarea
                  id="custom-query"
                  placeholder="SELECT * FROM argo_profiles WHERE temperature > 25 AND depth < 100..."
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  className="h-24"
                />
                <p className="text-xs text-gray-600">
                  Leave empty to export all selected data. Use SQL syntax for custom queries.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Export Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Export Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Selected Floats</span>
                  <span className="font-medium">{selectedFloats.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Profiles</span>
                  <span className="font-medium">{getTotalProfiles().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Format</span>
                  <Badge variant="outline">{exportFormat.toUpperCase()}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Date Range</span>
                  <span className="font-medium">{dateRange}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Size</span>
                  <span className="font-medium">{getEstimatedSize()}</span>
                </div>
              </div>

              <Separator />

              <Button 
                onClick={handleExport} 
                className="w-full"
                disabled={selectedFloats.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Start Export
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Format Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-xs text-gray-600">
                {exportFormat === 'netcdf' && (
                  <div>
                    <p className="font-medium text-gray-900">NetCDF</p>
                    <p>Standard oceanographic format with metadata support. Best for scientific analysis.</p>
                  </div>
                )}
                {exportFormat === 'csv' && (
                  <div>
                    <p className="font-medium text-gray-900">CSV</p>
                    <p>Comma-separated values. Easy to import into spreadsheets and statistical software.</p>
                  </div>
                )}
                {exportFormat === 'json' && (
                  <div>
                    <p className="font-medium text-gray-900">JSON</p>
                    <p>JavaScript Object Notation. Ideal for web applications and APIs.</p>
                  </div>
                )}
                {exportFormat === 'parquet' && (
                  <div>
                    <p className="font-medium text-gray-900">Parquet</p>
                    <p>Columnar storage format. Optimized for analytics and big data processing.</p>
                  </div>
                )}
                {exportFormat === 'hdf5' && (
                  <div>
                    <p className="font-medium text-gray-900">HDF5</p>
                    <p>Hierarchical data format. Supports complex data structures and large datasets.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Export Jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Archive className="h-5 w-5 text-purple-600" />
            <span>Export Jobs</span>
          </CardTitle>
          <CardDescription>
            Track the progress of your data export requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Name</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell className="font-medium">{job.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.format}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(job.status)}
                        <Badge variant="outline" className={getStatusColor(job.status)}>
                          {job.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="w-20">
                        <Progress value={job.progress} className="h-2" />
                        <span className="text-xs text-gray-600">{job.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{job.createdAt}</TableCell>
                    <TableCell className="text-sm">{job.fileSize || '-'}</TableCell>
                    <TableCell>
                      {job.status === 'completed' && job.downloadUrl ? (
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Download
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-3 w-3 mr-1" />
                          Pending
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}