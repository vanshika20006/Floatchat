import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Separator } from './ui/separator';
import { Search, MapPin, Filter, Download, Eye, Calendar, Thermometer } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'core' | 'bgc';
  status: 'active' | 'inactive';
  lat: number;
  lng: number;
  lastProfile: string;
  totalProfiles: number;
  temperature?: number;
  salinity?: number;
  depth: number;
  dataAvailable: string[];
}

export function FloatSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [region, setRegion] = useState('all');
  const [floatType, setFloatType] = useState('all');
  const [status, setStatus] = useState('all');
  const [showBGCOnly, setShowBGCOnly] = useState(false);
  const [dateRange, setDateRange] = useState('30d');

  // Mock search results
  const searchResults: SearchResult[] = [
    {
      id: '2902734',
      type: 'core',
      status: 'active',
      lat: -10.5,
      lng: 80.2,
      lastProfile: '2024-09-14',
      totalProfiles: 342,
      temperature: 28.5,
      salinity: 34.2,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure']
    },
    {
      id: '2902851',
      type: 'bgc',
      status: 'active',
      lat: -8.3,
      lng: 85.7,
      lastProfile: '2024-09-13',
      totalProfiles: 298,
      temperature: 29.1,
      salinity: 34.0,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure', 'oxygen', 'chlorophyll', 'nitrate', 'ph']
    },
    {
      id: '2902923',
      type: 'core',
      status: 'active',
      lat: -5.1,
      lng: 78.9,
      lastProfile: '2024-09-15',
      totalProfiles: 456,
      temperature: 29.8,
      salinity: 33.9,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure']
    },
    {
      id: '2903156',
      type: 'bgc',
      status: 'active',
      lat: -15.2,
      lng: 82.4,
      lastProfile: '2024-09-12',
      totalProfiles: 234,
      temperature: 26.2,
      salinity: 34.8,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure', 'oxygen', 'chlorophyll', 'backscatter']
    },
    {
      id: '2903201',
      type: 'core',
      status: 'active',
      lat: -12.8,
      lng: 88.1,
      lastProfile: '2024-09-14',
      totalProfiles: 387,
      temperature: 27.9,
      salinity: 34.3,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure']
    },
    {
      id: '2903287',
      type: 'bgc',
      status: 'inactive',
      lat: -18.5,
      lng: 76.3,
      lastProfile: '2024-08-28',
      totalProfiles: 523,
      temperature: 24.1,
      salinity: 35.1,
      depth: 2000,
      dataAvailable: ['temperature', 'salinity', 'pressure', 'oxygen', 'nitrate']
    }
  ];

  const filteredResults = searchResults.filter(result => {
    if (searchQuery && !result.id.includes(searchQuery)) return false;
    if (floatType !== 'all' && result.type !== floatType) return false;
    if (status !== 'all' && result.status !== status) return false;
    if (showBGCOnly && result.type !== 'bgc') return false;
    return true;
  });

  const handleSearch = () => {
    // In a real implementation, this would trigger an API call
    console.log('Searching with filters:', { searchQuery, region, floatType, status, dateRange });
  };

  const getParameterBadges = (parameters: string[]) => {
    const parameterColors: Record<string, string> = {
      temperature: 'bg-red-100 text-red-800',
      salinity: 'bg-blue-100 text-blue-800',
      pressure: 'bg-gray-100 text-gray-800',
      oxygen: 'bg-green-100 text-green-800',
      chlorophyll: 'bg-emerald-100 text-emerald-800',
      nitrate: 'bg-purple-100 text-purple-800',
      ph: 'bg-yellow-100 text-yellow-800',
      backscatter: 'bg-indigo-100 text-indigo-800'
    };

    return parameters.slice(0, 3).map(param => (
      <Badge 
        key={param} 
        variant="secondary" 
        className={`text-xs ${parameterColors[param] || 'bg-gray-100 text-gray-800'}`}
      >
        {param}
      </Badge>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-blue-600" />
            <span>ARGO Float Search</span>
          </CardTitle>
          <CardDescription>
            Search and filter ARGO floats based on location, type, and data availability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Search Bar and Primary Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Float ID</label>
                <Input
                  placeholder="Enter float ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Region</label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Regions</SelectItem>
                    <SelectItem value="arabian-sea">Arabian Sea</SelectItem>
                    <SelectItem value="bay-of-bengal">Bay of Bengal</SelectItem>
                    <SelectItem value="equatorial">Equatorial Indian Ocean</SelectItem>
                    <SelectItem value="southern">Southern Indian Ocean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Float Type</label>
                <Select value={floatType} onValueChange={setFloatType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="core">Core Floats</SelectItem>
                    <SelectItem value="bgc">BGC Floats</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator />

            {/* Additional Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Data Recency</label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="90d">Last 90 Days</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2 pt-6">
                <Checkbox
                  id="bgc-only"
                  checked={showBGCOnly}
                  onCheckedChange={setShowBGCOnly}
                />
                <label htmlFor="bgc-only" className="text-sm font-medium">
                  BGC Parameters Only
                </label>
              </div>

              <div className="flex items-end">
                <Button onClick={handleSearch} className="w-full">
                  <Search className="h-4 w-4 mr-2" />
                  Search Floats
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>
                Found {filteredResults.length} floats matching your criteria
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4 mr-2" />
                View on Map
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Float ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Last Profile</TableHead>
                  <TableHead>Profiles</TableHead>
                  <TableHead>Surface Data</TableHead>
                  <TableHead>Parameters</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredResults.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.id}</TableCell>
                    <TableCell>
                      <Badge variant={result.type === 'bgc' ? 'default' : 'secondary'}>
                        {result.type.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={result.status === 'active' ? 'default' : 'secondary'}>
                        {result.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {Math.abs(result.lat).toFixed(1)}°{result.lat < 0 ? 'S' : 'N'}, {result.lng.toFixed(1)}°E
                    </TableCell>
                    <TableCell className="text-sm">{result.lastProfile}</TableCell>
                    <TableCell>{result.totalProfiles}</TableCell>
                    <TableCell className="text-sm">
                      {result.temperature && (
                        <div className="flex items-center space-x-1">
                          <Thermometer className="h-3 w-3 text-red-500" />
                          <span>{result.temperature}°C</span>
                        </div>
                      )}
                      {result.salinity && (
                        <div className="text-xs text-gray-600">
                          {result.salinity} PSU
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {getParameterBadges(result.dataAvailable)}
                        {result.dataAvailable.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{result.dataAvailable.length - 3}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Floats</p>
                <p className="text-2xl font-bold">{filteredResults.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">BGC Floats</p>
                <p className="text-2xl font-bold">{filteredResults.filter(r => r.type === 'bgc').length}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Profiles</p>
                <p className="text-2xl font-bold">
                  {filteredResults.reduce((sum, r) => sum + r.totalProfiles, 0).toLocaleString()}
                </p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Calendar className="h-3 w-3 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Depth</p>
                <p className="text-2xl font-bold">
                  {Math.round(filteredResults.reduce((sum, r) => sum + r.depth, 0) / filteredResults.length)}m
                </p>
              </div>
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Filter className="h-3 w-3 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}