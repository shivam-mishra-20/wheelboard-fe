'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import LoginSimulator from '../../../components/LoginSimulator';
import { CompanyProtected } from '../../../components/ProtectedRoute';
import VehiclesListing from '@/components/company/VehiclesListing';
import VehicleFormModal from '@/components/company/VehicleFormModal';
import DriverFormModal from '@/components/company/DriverFormModal';
import DeleteConfirmationModal from '@/components/company/DeleteConfirmationModal';
import { wheelboardApi } from '../../../lib/wheelboardApi';
import { api } from '../../../lib/apiAdapter';

import { Vehicle, Driver } from '@/types/fleet';

export default function CompanyFleetPage() {
  const router = useRouter();

  // State for vehicles and drivers
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [isLoadingVehicles, setIsLoadingVehicles] = useState(true);
  const [isLoadingDrivers, setIsLoadingDrivers] = useState(true);

  // Fetch vehicles from API
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.transport.getVehiclesByUser(
          user.id
        );
        const vehiclesData = (response.data as any[]) || [];

        // Map API response to Vehicle interface
        const mappedVehicles: Vehicle[] = vehiclesData.map((apiVehicle) => ({
          id: apiVehicle.vehicleId,
          name: apiVehicle.vehicleModel,
          model: apiVehicle.vehicleModel,
          number: apiVehicle.vehicleNumber,
          registrationNumber: apiVehicle.vehicleNumber,
          year: apiVehicle.manufacturingYear,
          type: apiVehicle.vehicleType || 'Truck',
          image: apiVehicle.imageUrls?.[0] || '/truck-01.jpg',
          status: apiVehicle.status || 'Available',
          statusBadge:
            (apiVehicle.status as 'Assigned' | 'Available' | 'In Transit') ||
            'Available',
          ownership:
            (apiVehicle.ownershipType as 'Owned' | 'Attached') || 'Owned',
          location: apiVehicle.description || 'N/A',
          description: apiVehicle.description,
          driver: 'Unassigned',
          imageUrls: apiVehicle.imageUrls || [],
          metrics: {
            avgRun: 0,
            tripEfficiency: 0,
            monthlyUsage: 0,
            costPerKM: 0,
          },
          recentTrips: [],
          totalTrips: 0,
        }));

        setVehicles(mappedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
        setVehicles([]);
      } finally {
        setIsLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  // Fetch drivers from API
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const user = api.getCurrentUser();
        if (!user) return;

        const response = await wheelboardApi.transport.getDriversByUser(
          user.id
        );
        const driversData = (response.data as any[]) || [];

        // Map API response to Driver interface
        const mappedDrivers: Driver[] = driversData.map((apiDriver) => ({
          id: apiDriver.driverId,
          name: apiDriver.fullName || apiDriver.driverName,
          phone: apiDriver.contactNumber,
          phoneNumber: apiDriver.contactNumber,
          email: apiDriver.email || 'N/A',
          licenseNumber: apiDriver.licenseNumber,
          experience: 'N/A',
          status: (apiDriver.status as 'Available' | 'On Trip') || 'Available',
          vehicle: apiDriver.vehicleNumber || 'Unassigned',
          image: apiDriver.driverImageUrl || '/profile-pic.png',
          rating: 0,
          totalTrips: 0,
          location: 'N/A',
          joinedDate: apiDriver.createdAt || 'Recently joined',
          performance: {
            timelyDelivery: 0,
            tripEfficiency: 0,
            safety: 0,
          },
          reviews: [],
        }));

        setDrivers(mappedDrivers);
      } catch (error) {
        console.error('Error fetching drivers:', error);
        setDrivers([]);
      } finally {
        setIsLoadingDrivers(false);
      }
    };

    fetchDrivers();
  }, []);

  // Modal states
  const [isVehicleModalOpen, setIsVehicleModalOpen] = useState(false);
  const [isDriverModalOpen, setIsDriverModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Current items being edited/deleted
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
  const [currentDriver, setCurrentDriver] = useState<Driver | null>(null);
  const [deleteItem, setDeleteItem] = useState<{
    id: string;
    name: string;
    type: 'vehicle' | 'driver';
  } | null>(null);

  // Vehicle CRUD handlers
  const handleAddVehicle = () => {
    setCurrentVehicle(null);
    setIsVehicleModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setCurrentVehicle(vehicle);
    setIsVehicleModalOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setDeleteItem({
      id: vehicle.id,
      name: vehicle.name,
      type: 'vehicle',
    });
    setIsDeleteModalOpen(true);
  };

  const handleSaveVehicle = async (vehicleData: any) => {
    const loadingToast = toast.loading(
      currentVehicle ? 'Updating vehicle...' : 'Adding vehicle...'
    );

    try {
      const user = api.getCurrentUser();
      if (!user) {
        toast.error('Please login to manage vehicles', { id: loadingToast });
        return;
      }

      if (currentVehicle) {
        // Update existing vehicle
        await wheelboardApi.transport.updateVehicle({
          VehicleId: currentVehicle.id,
          UserId: user.id,
          VehicleModel: vehicleData.model || vehicleData.name,
          VehicleNumber: vehicleData.registrationNumber || vehicleData.number,
          ManufacturingYear: vehicleData.year || new Date().getFullYear(),
          OwnershipType: vehicleData.ownership || 'Owned',
          VehicleType: vehicleData.type || 'Truck',
          Description:
            vehicleData.description || vehicleData.location || 'No description',
          IsDeclarationAccepted: true,
          Images: vehicleData.images || [],
        });

        toast.success('Vehicle updated successfully!', { id: loadingToast });
      } else {
        // Add new vehicle
        await wheelboardApi.transport.addVehicle({
          UserId: user.id,
          VehicleModel: vehicleData.model || vehicleData.name,
          VehicleNumber: vehicleData.registrationNumber || vehicleData.number,
          ManufacturingYear: vehicleData.year || new Date().getFullYear(),
          OwnershipType: vehicleData.ownership || 'Owned',
          VehicleType: vehicleData.type || 'Truck',
          Description:
            vehicleData.description || vehicleData.location || 'No description',
          IsDeclarationAccepted: true,
          Images: vehicleData.images || [],
        });

        toast.success('Vehicle added successfully!', { id: loadingToast });
      }

      // Refresh vehicles list
      const response = await wheelboardApi.transport.getVehiclesByUser(user.id);
      const vehiclesData = (response.data as any[]) || [];
      const mappedVehicles: Vehicle[] = vehiclesData.map((apiVehicle) => ({
        id: apiVehicle.vehicleId,
        name: apiVehicle.vehicleModel,
        model: apiVehicle.vehicleModel,
        number: apiVehicle.vehicleNumber,
        registrationNumber: apiVehicle.vehicleNumber,
        year: apiVehicle.manufacturingYear,
        type: apiVehicle.vehicleType || 'Truck',
        image: apiVehicle.imageUrls?.[0] || '/truck-01.jpg',
        status: apiVehicle.status || 'Available',
        statusBadge:
          (apiVehicle.status as 'Assigned' | 'Available' | 'In Transit') ||
          'Available',
        ownership:
          (apiVehicle.ownershipType as 'Owned' | 'Attached') || 'Owned',
        location: apiVehicle.description || 'N/A',
        description: apiVehicle.description,
        driver: 'Unassigned',
        imageUrls: apiVehicle.imageUrls || [],
        metrics: {
          avgRun: 0,
          tripEfficiency: 0,
          monthlyUsage: 0,
          costPerKM: 0,
        },
        recentTrips: [],
        totalTrips: 0,
      }));
      setVehicles(mappedVehicles);
      setIsVehicleModalOpen(false);
    } catch (error: any) {
      console.error('Error saving vehicle:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(
            ([field, messages]: [string, any]) =>
              `${field}: ${messages.join(', ')}`
          )
          .join('\n');
        toast.error(`Failed to save vehicle:\n${errorMessages}`, {
          id: loadingToast,
          duration: 5000,
        });
      } else {
        toast.error('Failed to save vehicle. Please try again.', {
          id: loadingToast,
        });
      }
    }
  };

  const handleVehicleClick = (vehicleId: string) => {
    router.push(`/company/fleet/vehicles/${vehicleId}`);
  };

  // Driver CRUD handlers
  const handleAddDriver = () => {
    setCurrentDriver(null);
    setIsDriverModalOpen(true);
  };

  const handleEditDriver = (driver: Driver) => {
    setCurrentDriver(driver);
    setIsDriverModalOpen(true);
  };

  const handleDeleteDriver = (driver: Driver) => {
    setDeleteItem({
      id: driver.id,
      name: driver.name,
      type: 'driver',
    });
    setIsDeleteModalOpen(true);
  };

  const handleSaveDriver = async (driverData: any) => {
    const loadingToast = toast.loading(
      currentDriver ? 'Updating driver...' : 'Adding driver...'
    );

    try {
      const user = api.getCurrentUser();
      if (!user) {
        toast.error('Please login to manage drivers', { id: loadingToast });
        return;
      }

      if (currentDriver) {
        // Update existing driver
        await wheelboardApi.transport.updateDriver({
          DriverId: currentDriver.id,
          FullName: driverData.name,
          ContactNumber: driverData.phoneNumber || driverData.phone,
          VehicleType: driverData.vehicleType || 'Truck',
          VehicleNumber: driverData.currentVehicle || 'N/A',
          Description: driverData.description || 'No description',
          IsDeclarationAccepted: true,
          Image: driverData.image,
          ModifiedUserId: user.id,
        });

        toast.success('Driver updated successfully!', { id: loadingToast });
      } else {
        // Add new driver
        await wheelboardApi.transport.addDriver({
          UserId: user.id,
          FullName: driverData.name,
          ContactNumber: driverData.phoneNumber || driverData.phone,
          VehicleType: driverData.vehicleType || 'Truck',
          VehicleNumber: driverData.currentVehicle || 'N/A',
          Description: driverData.description || 'No description',
          IsDeclarationAccepted: true,
          Image: driverData.image,
        });

        toast.success('Driver added successfully!', { id: loadingToast });
      }

      // Refresh drivers list
      const response = await wheelboardApi.transport.getDriversByUser(user.id);
      const driversData = (response.data as any[]) || [];
      const mappedDrivers: Driver[] = driversData.map((apiDriver) => ({
        id: apiDriver.driverId,
        name: apiDriver.fullName || apiDriver.driverName,
        phone: apiDriver.contactNumber,
        phoneNumber: apiDriver.contactNumber,
        email: apiDriver.email || 'N/A',
        licenseNumber: apiDriver.licenseNumber || 'N/A',
        experience: 'N/A',
        status: (apiDriver.status as 'Available' | 'On Trip') || 'Available',
        vehicle: apiDriver.vehicleNumber || 'Unassigned',
        image: apiDriver.driverImageUrl || '/profile-pic.png',
        rating: 0,
        totalTrips: 0,
        location: 'N/A',
        joinedDate: apiDriver.createdAt || 'Recently joined',
        performance: {
          timelyDelivery: 0,
          tripEfficiency: 0,
          safety: 0,
        },
        reviews: [],
      }));
      setDrivers(mappedDrivers);
      setIsDriverModalOpen(false);
    } catch (error: any) {
      console.error('Error saving driver:', error);
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        const errorMessages = Object.entries(errors)
          .map(
            ([field, messages]: [string, any]) =>
              `${field}: ${messages.join(', ')}`
          )
          .join('\n');
        toast.error(`Failed to save driver:\n${errorMessages}`, {
          id: loadingToast,
          duration: 5000,
        });
      } else {
        toast.error('Failed to save driver. Please try again.', {
          id: loadingToast,
        });
      }
    }
  };

  const handleDriverClick = (driverId: string) => {
    router.push(`/company/fleet/drivers/${driverId}`);
  };

  // Delete confirmation handler
  const handleConfirmDelete = async () => {
    if (!deleteItem) return;

    const loadingToast = toast.loading(`Deleting ${deleteItem.type}...`);

    try {
      const user = api.getCurrentUser();
      if (!user) {
        toast.error('Please login to delete items', { id: loadingToast });
        return;
      }

      if (deleteItem.type === 'vehicle') {
        await wheelboardApi.transport.deleteVehicle(deleteItem.id, user.id);
        setVehicles((prev) => prev.filter((v) => v.id !== deleteItem.id));
        toast.success('Vehicle deleted successfully!', { id: loadingToast });
      } else {
        await wheelboardApi.transport.deleteDriver(deleteItem.id, user.id);
        setDrivers((prev) => prev.filter((d) => d.id !== deleteItem.id));
        toast.success('Driver deleted successfully!', { id: loadingToast });
      }

      setDeleteItem(null);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(`Failed to delete ${deleteItem.type}. Please try again.`, {
        id: loadingToast,
      });
    }
  };

  return (
    <CompanyProtected>
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#333',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            style: {
              background: '#10b981',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
        }}
      />

      {/* Unified Header */}
      <Header />

      {/* Login Simulator for Testing */}
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Vehicles & Drivers Listing Section */}
          {isLoadingVehicles || isLoadingDrivers ? (
            <div className="mb-12 flex items-center justify-center py-16">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-[#f36969]"></div>
              <p className="ml-4 text-lg text-gray-600">
                Loading fleet data...
              </p>
            </div>
          ) : (
            <VehiclesListing
              vehicles={vehicles}
              drivers={drivers}
              onAddVehicle={handleAddVehicle}
              onEditVehicle={handleEditVehicle}
              onDeleteVehicle={handleDeleteVehicle}
              onVehicleClick={handleVehicleClick}
              onAddDriver={handleAddDriver}
              onEditDriver={handleEditDriver}
              onDeleteDriver={handleDeleteDriver}
              onDriverClick={handleDriverClick}
            />
          )}
        </main>

        {/* Shared Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <VehicleFormModal
        isOpen={isVehicleModalOpen}
        onClose={() => setIsVehicleModalOpen(false)}
        onSave={handleSaveVehicle}
        mode={currentVehicle ? 'edit' : 'add'}
      />

      <DriverFormModal
        isOpen={isDriverModalOpen}
        onClose={() => setIsDriverModalOpen(false)}
        onSave={handleSaveDriver}
        driver={currentDriver}
        mode={currentDriver ? 'edit' : 'add'}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeleteItem(null);
        }}
        onConfirm={handleConfirmDelete}
        title={`Delete ${deleteItem?.type === 'vehicle' ? 'Vehicle' : 'Driver'}?`}
        message={`Are you sure you want to delete this ${deleteItem?.type}?`}
        itemName={deleteItem?.name || ''}
        type={deleteItem?.type || 'vehicle'}
      />
    </CompanyProtected>
  );
}
