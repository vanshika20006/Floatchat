import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Separator } from './ui/separator';
import { MapPin, Layers, Filter, Eye, EyeOff } from 'lucide-react';

interface Float {
  id: string;
  lat: number;
  lng: number;
  type: 'core' | 'bgc';
  status: 'active' | 'inactive';
  lastProfile: string;
  temperature?: number;
  salinity?: number;
}

export function MapView() {
  const [selectedFloat, setSelectedFloat] = useState<Float | null>(null);
  const [showCore, setShowCore] = useState(true);
  const [showBGC, setShowBGC] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');

  // Mock ARGO float data for Indian Ocean
  const floats: Float[] = [
    { id: '2902734', lat: -10.5, lng: 80.2, type: 'core', status: 'active', lastProfile: '2024-09-14', temperature: 28.5, salinity: 34.2 },
    { id: '2902851', lat: -8.3, lng: 85.7, type: 'bgc', status: 'active', lastProfile: '2024-09-13', temperature: 29.1, salinity: 34.0 },
    { id: '2902923', lat: -5.1, lng: 78.9, type: 'core', status: 'active', lastProfile: '2024-09-15', temperature: 29.8, salinity: 33.9 },
    { id: '2903156', lat: -15.2, lng: 82.4, type: 'bgc', status: 'active', lastProfile: '2024-09-12', temperature: 26.2, salinity: 34.8 },
    { id: '2903201', lat: -12.8, lng: 88.1, type: 'core', status: 'active', lastProfile: '2024-09-14', temperature: 27.9, salinity: 34.3 },
    { id: '2903287', lat: -18.5, lng: 76.3, type: 'bgc', status: 'inactive', lastProfile: '2024-08-28', temperature: 24.1, salinity: 35.1 },
    { id: '2903342', lat: -2.7, lng: 83.6, type: 'core', status: 'active', lastProfile: '2024-09-15', temperature: 30.2, salinity: 33.7 },
    { id: '2903418', lat: -20.1, lng: 79.8, type: 'bgc', status: 'active', lastProfile: '2024-09-13', temperature: 23.8, salinity: 35.2 },
    { id: '2903467', lat: -7.9, lng: 91.2, type: 'core', status: 'active', lastProfile: '2024-09-14', temperature: 28.7, salinity: 34.1 },
    { id: '2903534', lat: -13.4, lng: 74.5, type: 'bgc', status: 'active', lastProfile: '2024-09-12', temperature: 27.3, salinity: 34.5 }
  ];

  const filteredFloats = floats.filter(float => {
    if (!showCore && float.type === 'core') return false;
    if (!showBGC && float.type === 'bgc') return false;
    return true;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <span>ARGO Float Locations - Indian Ocean</span>
            </CardTitle>
            <CardDescription>
              Interactive map showing active and inactive ARGO floats with real-time positions
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Map Container - Simulated */}
            <div className="relative bg-gradient-to-br from-blue-100 to-blue-300 rounded-lg h-[500px] overflow-hidden">
              {/* Simulated Ocean Background */}
              <div className="absolute inset-0 opacity-30">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400"></div>
                <div className="absolute top-10 left-10 w-32 h-16 bg-green-200 rounded-full opacity-40"></div>
                <div className="absolute top-20 right-20 w-24 h-12 bg-green-300 rounded-lg opacity-30"></div>
                <div className="absolute bottom-20 left-1/4 w-40 h-20 bg-green-200 rounded-full opacity-35"></div>
              </div>

              {/* Grid lines for reference */}
              <div className="absolute inset-0">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="absolute h-full w-px bg-white opacity-20"
                    style={{ left: `${i * 10}%` }}
                  />
                ))}
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="absolute w-full h-px bg-white opacity-20"
                    style={{ top: `${i * 10}%` }}
                  />
                ))}
              </div>

              {/* Float Markers */}
              {filteredFloats.map((float) => {
                const x = ((float.lng - 70) / 25) * 100; // Normalize longitude to percentage
                const y = ((float.lat + 25) / 25) * 100; // Normalize latitude to percentage
                
                return (
                  <div
                    key={float.id}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all hover:scale-110 ${
                      selectedFloat?.id === float.id ? 'scale-125 z-10' : ''
                    }`}
                    style={{ left: `${x}%`, top: `${100 - y}%` }}
                    onClick={() => setSelectedFloat(float)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 border-white shadow-lg ${
                        float.status === 'active'
                          ? float.type === 'bgc'
                            ? 'bg-green-500'
                            : 'bg-blue-500'
                          : 'bg-gray-400'
                      }`}
                    />
                    {selectedFloat?.id === float.id && (
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-white p-2 rounded shadow-lg text-xs whitespace-nowrap">
                        <div className="font-medium">{float.id}</div>
                        <div className="text-gray-600">
                          {float.lat.toFixed(1)}°S, {float.lng.toFixed(1)}°E
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Coordinate Labels */}
              <div className="absolute top-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                25°N, 70°E
              </div>
              <div className="absolute top-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                25°N, 95°E
              </div>
              <div className="absolute bottom-2 left-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                25°S, 70°E
              </div>
              <div className="absolute bottom-2 right-2 text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded">
                25°S, 95°E
              </div>
            </div>

            {/* Map Legend */}
            <div className="mt-4 flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
                <span>Core Float (Active)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full border border-white"></div>
                <span>BGC Float (Active)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full border border-white"></div>
                <span>Inactive Float</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Map Filters</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-core"
                  checked={showCore}
                  onCheckedChange={setShowCore}
                />
                <label htmlFor="show-core" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Core Floats ({floats.filter(f => f.type === 'core').length})
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-bgc"
                  checked={showBGC}
                  onCheckedChange={setShowBGC}
                />
                <label htmlFor="show-bgc" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  BGC Floats ({floats.filter(f => f.type === 'bgc').length})
                </label>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <label className="text-sm font-medium">Time Filter</label>
              <Select value={timeFilter} onValueChange={setTimeFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="90d">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedFloat && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Float Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Float ID</span>
                  <Badge variant="outline">{selectedFloat.id}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Type</span>
                  <Badge variant={selectedFloat.type === 'bgc' ? 'default' : 'secondary'}>
                    {selectedFloat.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Status</span>
                  <Badge variant={selectedFloat.status === 'active' ? 'default' : 'secondary'}>
                    {selectedFloat.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Position</span>
                  <span className="text-gray-600">
                    {selectedFloat.lat.toFixed(2)}°S, {selectedFloat.lng.toFixed(2)}°E
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Profile</span>
                  <span className="text-gray-600">{selectedFloat.lastProfile}</span>
                </div>
                {selectedFloat.temperature && (
                  <div className="flex items-center justify-between">
                    <span>Surface Temp</span>
                    <span className="text-gray-600">{selectedFloat.temperature}°C</span>
                  </div>
                )}
                {selectedFloat.salinity && (
                  <div className="flex items-center justify-between">
                    <span>Surface Salinity</span>
                    <span className="text-gray-600">{selectedFloat.salinity} PSU</span>
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <Button size="sm" className="w-full">
                    View Profiles
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Download Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Map Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Total Floats</span>
                <span className="font-medium">{filteredFloats.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Active Floats</span>
                <span className="font-medium text-green-600">
                  {filteredFloats.filter(f => f.status === 'active').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>BGC Enabled</span>
                <span className="font-medium text-blue-600">
                  {filteredFloats.filter(f => f.type === 'bgc').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Coverage Area</span>
                <span className="font-medium">2.1M km²</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}