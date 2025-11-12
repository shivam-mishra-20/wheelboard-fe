# Phase 2 - Systematic API Testing Results

## Test Account

- **Mobile**: 9123456789
- **Password**: Test@123
- **UserId**: f8158a17-7bab-4a35-82b8-a223a25a2eab
- **UserType**: Company
- **BusinessCategory**: transport

---

## 1. Job APIs ✅

### POST /api/Job/add-job

**Request Fields (multipart/form-data):**

```
UserId: string (required)
Role: string (required)
City: string (required)
Description: string (required)
JobType: string (required) - e.g., "Full-time"
JobDuration: string (required) - e.g., "6 months"
Images: File[] (required)
```

**Response:**

```json
{
  "message": "Job created successfully",
  "jobId": "4b959a1a-25cd-4d37-b9dc-c776bf9618d4"
}
```

### GET /api/Job/job-list/{userId}

**Response:**

```json
[
  {
    "jobId": "4b959a1a-25cd-4d37-b9dc-c776bf9618d4",
    "role": "Heavy Equipment Operator",
    "jobDuration": "6 months",
    "openings": 0,
    "salary": 0.0,
    "city": "Mumbai",
    "jobType": "Full-time",
    "description": "Looking for experienced operator",
    "imagePaths": [
      "https://wheelboardapi.addonshareware.com/uploads/jobs/600450a8-820f-4041-9a3f-af7e57af1751_excavator.jpg"
    ]
  }
]
```

**Field Mapping:**

- `jobId` → unique identifier
- `role` → job title/position
- `jobDuration` → contract length
- `openings` → number of positions (0 in response, might be unused)
- `salary` → compensation (0.00 in response, might be unused)
- `city` → location
- `jobType` → employment type (Full-time, Part-time, Contract)
- `description` → job details
- `imagePaths` → array of image URLs

---

## 2. Vehicle APIs ✅

### POST /api/Transport/add-vehicle

**Request Fields (multipart/form-data):**

```
UserId: string (required)
VehicleType: string (required) - e.g., "Dumper"
VehicleNumber: string (required) - e.g., "MH02AB1234"
VehicleModel: string (required) - e.g., "Tata Prima 2518K"
OwnershipType: string (required) - "Owned" or "Leased"
Description: string (required)
Images: File[] (required)
```

**Response:**

```json
{
  "message": "Vehicle added successfully",
  "vehicleId": "799ff989-248c-4450-810d-0d11be4a59df"
}
```

### GET /api/Transport/vehicle/{userId}

**Response:**

```json
[
  {
    "vehicleId": "799ff989-248c-4450-810d-0d11be4a59df",
    "userId": "f8158a17-7bab-4a35-82b8-a223a25a2eab",
    "vehicleModel": "Tata Prima 2518K",
    "vehicleNumber": "MH02AB1234",
    "manufacturingYear": 0,
    "ownershipType": "Owned",
    "vehicleType": "Dumper",
    "description": "25 ton capacity dumper truck",
    "isDeclarationAccepted": false,
    "status": "Available",
    "imageUrls": [
      "https://wheelboardapi.addonshareware.com/uploads/vehicles/214fad84-e8b5-45df-8412-a1f1312ea404_red-truck.png"
    ]
  }
]
```

**Field Mapping:**

- `vehicleId` → unique identifier
- `vehicleModel` → make and model
- `vehicleNumber` → registration/license plate
- `manufacturingYear` → year (0 in response, might be optional)
- `ownershipType` → Owned/Leased
- `vehicleType` → category (Dumper, Truck, etc.)
- `description` → vehicle details
- `status` → availability status
- `imageUrls` → array of image URLs

---

## 3. Driver APIs ⚠️ (Needs Investigation)

### POST /api/Transport/add-driver

**Request Fields (multipart/form-data):**

```
UserId: string (required)
FullName: string (required) - NOT "DriverName"
VehicleType: string (required) - e.g., "Dumper"
VehicleNumber: string (required) - e.g., "MH02AB1234"
LicenseNumber: string (required)
LicenseExpiry: string (required) - format: "YYYY-MM-DD"
ContactNumber: string (required)
Address: string (required)
DateOfBirth: string (required) - format: "YYYY-MM-DD"
DriverImage: File (optional)
LicenseDocument: File (optional)
```

**Response:**

```json
{
  "message": "Driver added successfully",
  "driverId": "ee2ef952-9001-4a45-a89b-766a982c10ea"
}
```

**Note:** API validation error revealed actual field names differ from wheelboardApi.ts:

- ❌ `DriverName` → ✅ `FullName`
- Requires vehicle info (VehicleType, VehicleNumber) which suggests driver-vehicle association

### GET /api/Transport/driver/{userId}

**Status:** Returns empty or no response
**Action:** Need to investigate further or skip driver integration initially

---

## 4. Services APIs (To Test)

### GET /api/Service/service-list/{userId}

**Status:** Not yet tested
**Next:** Create service first, then test

---

## 5. Posts/Feeds APIs (To Test)

### GET /api/Post/user/{userId}

**Status:** Not yet tested
**Next:** Create post first, then test

---

## Integration Strategy

### Phase 2A: Jobs Module ✅ Ready

1. Replace `companyHomeData.allJobs` with `wheelboardApi.job.getJobList(userId)`
2. Map API response fields to UI components
3. Implement create/edit/delete using real API

### Phase 2B: Fleet Module (Vehicles) ✅ Ready

1. Replace mock vehicle data with `wheelboardApi.transport.getVehicleList(userId)`
2. Map API response fields to UI
3. Implement add/edit/delete vehicles

### Phase 2C: Fleet Module (Drivers) ⏳ Pending Investigation

1. Test driver GET endpoint again
2. If working, integrate driver list
3. If not working, report to backend team

### Phase 2D: Dashboard ✅ Can Start

1. Aggregate data from Jobs + Vehicles APIs
2. Display statistics and summaries

### Phase 2E: Services & Feeds ⏳ Pending API Tests

1. Test endpoints after creating test data
2. Integrate once response structure confirmed

---

## Next Immediate Steps

1. **Start with Jobs page integration** - We have complete request/response understanding
2. **Update wheelboardApi.ts** - Fix driver field names (DriverName → FullName)
3. **Create todo list** for systematic integration
4. **Begin Jobs page** - Read current UI, map to API responses, integrate
