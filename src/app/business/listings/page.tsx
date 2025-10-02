'use client';

import Image from 'next/image';
import Header from '../../../components/Header';
import LoginSimulator from '../../../components/LoginSimulator';
import Footer from '../../../components/Footer';
import { BusinessProtected } from '../../../components/ProtectedRoute';
import { useState } from 'react';
import {
  Card,
  Rate,
  Tag,
  Button,
  Badge,
  Space,
  Typography,
  Row,
  Col,
  Segmented,
  Input,
  Select,
  Avatar,
  Tooltip,
} from 'antd';
import {
  HeartOutlined,
  HeartFilled,
  ShoppingCartOutlined,
  EyeOutlined,
  VerifiedOutlined,
  SearchOutlined,
  AppstoreOutlined,
  BarsOutlined,
  PhoneOutlined,
  ShopOutlined,
} from '@ant-design/icons';

const { Text, Title, Paragraph } = Typography;
const { Search } = Input;

export default function BusinessListingsPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<number[]>([]);

  const slides = [
    { id: 1, image: '/business-profile.png', alt: 'Business listings' },
    { id: 2, image: '/dashboard.png', alt: 'Inventory management' },
    { id: 3, image: '/network.png', alt: 'Business network' },
  ];

  const nextSlide = () => setCurrentSlide((s) => (s + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((s) => (s - 1 + slides.length) % slides.length);

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Parts & Components', value: 'Parts & Components' },
    { label: 'Maintenance Services', value: 'Maintenance Services' },
    { label: 'Fuel & Lubricants', value: 'Fuel & Lubricants' },
    { label: 'Insurance', value: 'Insurance' },
    { label: 'Financing', value: 'Financing' },
    { label: 'Equipment', value: 'Equipment' },
    { label: 'Software', value: 'Software' },
  ];

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]
    );
  };

  const listings = [
    {
      id: 1,
      title: 'Premium Engine Oil - 20W-50',
      category: 'Fuel & Lubricants',
      price: '₹850/Liter',
      description:
        'High-quality synthetic engine oil suitable for heavy-duty vehicles. Provides excellent protection and performance.',
      images: ['/tires.png', '/truck-01.jpg'],
      business: {
        name: 'AutoParts Pro',
        rating: 4.8,
        reviews: 156,
        verified: true,
        location: 'Mumbai, Maharashtra',
      },
      specifications: {
        brand: 'Castrol',
        viscosity: '20W-50',
        volume: '1 Liter',
        type: 'Synthetic',
      },
      inStock: true,
      quantity: 250,
      tags: ['Heavy Duty', 'Synthetic', 'Premium'],
      discount: 15,
      originalPrice: '₹1000',
      featured: true,
    },
    {
      id: 2,
      title: 'Heavy Duty Truck Tires - 295/80R22.5',
      category: 'Parts & Components',
      price: '₹18,500/Piece',
      description:
        'Durable truck tires designed for long-haul transportation. Superior grip and extended tread life.',
      images: ['/tires.png', '/truck-CTA.png'],
      business: {
        name: 'TireMaster Solutions',
        rating: 4.9,
        reviews: 89,
        verified: true,
        location: 'Delhi, NCR',
      },
      specifications: {
        size: '295/80R22.5',
        brand: 'Bridgestone',
        pattern: 'All Season',
        warranty: '2 Years',
      },
      inStock: true,
      quantity: 45,
      tags: ['Heavy Duty', 'Long Haul', 'Warranty'],
      discount: 10,
      originalPrice: '₹20,500',
      featured: false,
    },
    {
      id: 3,
      title: 'Fleet Management Software License',
      category: 'Software',
      price: '₹2,500/Month',
      description:
        'Comprehensive fleet management solution with GPS tracking, maintenance scheduling, and driver management.',
      images: ['/dashboard.png', '/live-truck.gif'],
      business: {
        name: 'TechFleet Solutions',
        rating: 4.7,
        reviews: 203,
        verified: true,
        location: 'Bangalore, Karnataka',
      },
      specifications: {
        users: 'Up to 50 vehicles',
        features: 'GPS, Maintenance, Reports',
        support: '24/7 Support',
        trial: '30 Days Free',
      },
      inStock: true,
      quantity: 'Unlimited',
      tags: ['Software', 'GPS Tracking', 'Fleet Management'],
      discount: 20,
      originalPrice: '₹3,125',
      featured: true,
    },
    {
      id: 4,
      title: 'Vehicle Insurance - Commercial',
      category: 'Insurance',
      price: '₹45,000/Year',
      description:
        'Comprehensive commercial vehicle insurance with coverage for accidents, theft, and third-party liability.',
      images: ['/business-profile.png', '/truck-01.jpg'],
      business: {
        name: 'SecureAuto Insurance',
        rating: 4.6,
        reviews: 312,
        verified: true,
        location: 'Chennai, Tamil Nadu',
      },
      specifications: {
        coverage: 'Comprehensive',
        idv: '₹15 Lakhs',
        addon: 'Zero Depreciation',
        claim: '24/7 Claim Support',
      },
      inStock: true,
      quantity: 'Available',
      tags: ['Insurance', 'Comprehensive', 'Commercial'],
      discount: 25,
      originalPrice: '₹60,000',
      featured: false,
    },
    {
      id: 5,
      title: 'Hydraulic Jack - 20 Ton Capacity',
      category: 'Equipment',
      price: '₹12,500/Piece',
      description:
        'Heavy-duty hydraulic jack suitable for lifting trucks and heavy machinery. Made with high-grade steel.',
      images: ['/bulldozer.png', '/excavator.jpg'],
      business: {
        name: 'ToolMaster Equipment',
        rating: 4.5,
        reviews: 76,
        verified: true,
        location: 'Pune, Maharashtra',
      },
      specifications: {
        capacity: '20 Ton',
        material: 'High Grade Steel',
        height: 'Min: 285mm, Max: 465mm',
        warranty: '1 Year',
      },
      inStock: true,
      quantity: 28,
      tags: ['Heavy Duty', 'Steel', 'Warranty'],
      discount: 12,
      originalPrice: '₹14,200',
      featured: false,
    },
    {
      id: 6,
      title: 'Vehicle Maintenance Service Package',
      category: 'Maintenance Services',
      price: '₹8,500/Service',
      description:
        'Complete vehicle maintenance service including oil change, filter replacement, brake inspection, and more.',
      images: ['/support.png', '/truck-01.jpg'],
      business: {
        name: 'ProService Auto',
        rating: 4.9,
        reviews: 145,
        verified: true,
        location: 'Hyderabad, Telangana',
      },
      specifications: {
        includes: 'Oil, Filters, Brake Check',
        duration: '2-3 Hours',
        warranty: '6 Months',
        pickup: 'Free Pickup & Drop',
      },
      inStock: true,
      quantity: 'Available',
      tags: ['Complete Service', 'Warranty', 'Pickup'],
      discount: 18,
      originalPrice: '₹10,366',
      featured: true,
    },
  ];

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      searchQuery === '' ||
      listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      listing.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === 'all' || listing.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <BusinessProtected>
      <Header />
      <LoginSimulator />

      <div className="min-h-screen bg-gray-50 pt-16 font-poppins">
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="relative mb-12 overflow-hidden rounded-3xl bg-white shadow-lg">
            <div className="relative h-64 md:h-80">
              <div className="relative h-full w-full">
                <Image
                  src={slides[currentSlide].image}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <h1 className="mb-4 text-4xl font-bold md:text-5xl">
                    Business Marketplace
                  </h1>
                  <p className="text-lg md:text-xl">
                    Discover premium products and services for your business
                  </p>
                </div>
              </div>

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md hover:bg-white"
              >
                <svg
                  className="h-5 w-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 w-2 rounded-full transition-colors ${i === currentSlide ? 'bg-white' : 'bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} md={12}>
              <Search
                placeholder="Search products, brands, or businesses..."
                allowClear
                enterButton={<SearchOutlined />}
                size="large"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%' }}
              />
            </Col>
            <Col xs={24} md={8}>
              <Select
                placeholder="Select Category"
                size="large"
                style={{ width: '100%' }}
                value={activeCategory}
                onChange={setActiveCategory}
                options={categories}
              />
            </Col>
            <Col xs={24} md={4}>
              <Segmented
                options={[
                  { value: 'grid', icon: <AppstoreOutlined /> },
                  { value: 'list', icon: <BarsOutlined /> },
                ]}
                value={viewMode}
                onChange={(value) => setViewMode(value as string)}
                style={{ width: '100%' }}
              />
            </Col>
          </Row>

          {/* Stats and Create Listing */}
          <Row gutter={[16, 16]} className="mb-8">
            <Col xs={24} md={16}>
              <Card
                style={{
                  background:
                    'linear-gradient(135deg, #FF6B35 0%, #F7931E 100%)',
                  border: 'none',
                  color: 'white',
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Title level={3} style={{ color: 'white', margin: 0 }}>
                      List Your Products
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.9)' }}>
                      Reach thousands of potential customers
                    </Text>
                  </Col>
                  <Col>
                    <Button
                      type="primary"
                      size="large"
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'white',
                        color: '#FF6B35',
                        fontWeight: 600,
                      }}
                      icon={<ShopOutlined />}
                    >
                      Create Listing
                    </Button>
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Space direction="vertical" style={{ width: '100%' }}>
                  <Title level={4} style={{ margin: 0, color: '#FF6B35' }}>
                    {filteredListings.length}
                  </Title>
                  <Text type="secondary">Products Available</Text>
                </Space>
              </Card>
            </Col>
          </Row>

          {/* Listings Grid/List */}
          {viewMode === 'grid' ? (
            <Row gutter={[24, 24]}>
              {filteredListings.map((listing) => (
                <Col key={listing.id} xs={24} sm={12} lg={8}>
                  <Badge.Ribbon
                    text={listing.featured ? '⭐ Featured' : ''}
                    color="#FF6B35"
                    style={{
                      display: listing.featured ? 'block' : 'none',
                    }}
                  >
                    <Card
                      hoverable
                      cover={
                        <div style={{ position: 'relative', height: 240 }}>
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {!listing.inStock && (
                            <div
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                              }}
                            >
                              <Tag color="red">Out of Stock</Tag>
                            </div>
                          )}
                        </div>
                      }
                      actions={[
                        <Button
                          key="contact"
                          type="primary"
                          style={{
                            backgroundColor: '#FF6B35',
                            borderColor: '#FF6B35',
                          }}
                          icon={<PhoneOutlined />}
                        >
                          Contact
                        </Button>,
                        <Button
                          key="favorite"
                          type="text"
                          icon={
                            favorites.includes(listing.id) ? (
                              <HeartFilled style={{ color: '#FF6B35' }} />
                            ) : (
                              <HeartOutlined />
                            )
                          }
                          onClick={() => toggleFavorite(listing.id)}
                        />,
                        <Button key="view" type="text" icon={<EyeOutlined />}>
                          View
                        </Button>,
                      ]}
                      styles={{
                        body: { padding: '16px' },
                      }}
                    >
                      <Card.Meta
                        title={
                          <Space direction="vertical" size={4}>
                            <Title level={5} style={{ margin: 0 }}>
                              {listing.title}
                            </Title>
                            <Space size={4}>
                              <Tag color="#FF6B35">{listing.category}</Tag>
                              {listing.discount > 0 && (
                                <Tag color="green">{listing.discount}% OFF</Tag>
                              )}
                            </Space>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size={8}>
                            <Paragraph
                              ellipsis={{ rows: 2 }}
                              style={{ margin: 0 }}
                            >
                              {listing.description}
                            </Paragraph>
                            <div>
                              <Space align="baseline">
                                <Title
                                  level={4}
                                  style={{ margin: 0, color: '#FF6B35' }}
                                >
                                  {listing.price}
                                </Title>
                                {listing.discount > 0 && (
                                  <Text delete type="secondary">
                                    {listing.originalPrice}
                                  </Text>
                                )}
                              </Space>
                            </div>
                            <Space direction="vertical" size={4}>
                              <Space align="center">
                                <Avatar
                                  size="small"
                                  src="/business-profile.png"
                                />
                                <Text strong>{listing.business.name}</Text>
                                {listing.business.verified && (
                                  <Tooltip title="Verified Business">
                                    <VerifiedOutlined
                                      style={{ color: '#1890ff' }}
                                    />
                                  </Tooltip>
                                )}
                              </Space>
                              <Space align="center">
                                <Rate
                                  disabled
                                  defaultValue={listing.business.rating}
                                  style={{ fontSize: 12 }}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {listing.business.rating} (
                                  {listing.business.reviews} reviews)
                                </Text>
                              </Space>
                            </Space>
                            <div>
                              {listing.tags.slice(0, 3).map((tag, index) => (
                                <Tag
                                  key={index}
                                  color="default"
                                  style={{ marginBottom: 4 }}
                                >
                                  #{tag}
                                </Tag>
                              ))}
                            </div>
                          </Space>
                        }
                      />
                    </Card>
                  </Badge.Ribbon>
                </Col>
              ))}
            </Row>
          ) : (
            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {filteredListings.map((listing) => (
                <Badge.Ribbon
                  key={listing.id}
                  text={listing.featured ? '⭐ Featured' : ''}
                  color="#FF6B35"
                  style={{
                    display: listing.featured ? 'block' : 'none',
                  }}
                >
                  <Card hoverable>
                    <Row gutter={16}>
                      <Col xs={24} md={6}>
                        <div style={{ position: 'relative', height: 160 }}>
                          <Image
                            src={listing.images[0]}
                            alt={listing.title}
                            fill
                            style={{
                              objectFit: 'cover',
                              borderRadius: '8px',
                            }}
                          />
                        </div>
                      </Col>
                      <Col xs={24} md={18}>
                        <Row justify="space-between" align="top">
                          <Col xs={24} md={16}>
                            <Space direction="vertical" size={8}>
                              <div>
                                <Title level={4} style={{ margin: 0 }}>
                                  {listing.title}
                                </Title>
                                <Space size={8}>
                                  <Tag color="#FF6B35">{listing.category}</Tag>
                                  {listing.featured && (
                                    <Tag color="purple">Featured</Tag>
                                  )}
                                </Space>
                              </div>
                              <Paragraph
                                ellipsis={{ rows: 2 }}
                                style={{ margin: 0 }}
                              >
                                {listing.description}
                              </Paragraph>
                              <Space align="center">
                                <Avatar
                                  size="small"
                                  src="/business-profile.png"
                                />
                                <Text strong>{listing.business.name}</Text>
                                {listing.business.verified && (
                                  <VerifiedOutlined
                                    style={{ color: '#1890ff' }}
                                  />
                                )}
                                <Rate
                                  disabled
                                  defaultValue={listing.business.rating}
                                  style={{ fontSize: 12 }}
                                />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  ({listing.business.reviews})
                                </Text>
                              </Space>
                              <div>
                                {listing.tags.map((tag, index) => (
                                  <Tag
                                    key={index}
                                    color="default"
                                    style={{ marginBottom: 4 }}
                                  >
                                    #{tag}
                                  </Tag>
                                ))}
                              </div>
                            </Space>
                          </Col>
                          <Col xs={24} md={8} style={{ textAlign: 'right' }}>
                            <Space direction="vertical" size={8}>
                              <div>
                                <Space align="baseline">
                                  <Title
                                    level={3}
                                    style={{ margin: 0, color: '#FF6B35' }}
                                  >
                                    {listing.price}
                                  </Title>
                                  {listing.discount > 0 && (
                                    <Text delete type="secondary">
                                      {listing.originalPrice}
                                    </Text>
                                  )}
                                </Space>
                                {listing.discount > 0 && (
                                  <div>
                                    <Text
                                      strong
                                      style={{ color: '#52c41a', fontSize: 14 }}
                                    >
                                      Save {listing.discount}%
                                    </Text>
                                  </div>
                                )}
                              </div>
                              <Space>
                                <Button
                                  type="primary"
                                  style={{
                                    backgroundColor: '#FF6B35',
                                    borderColor: '#FF6B35',
                                  }}
                                  icon={<PhoneOutlined />}
                                >
                                  Contact
                                </Button>
                                <Button
                                  icon={
                                    favorites.includes(listing.id) ? (
                                      <HeartFilled
                                        style={{ color: '#FF6B35' }}
                                      />
                                    ) : (
                                      <HeartOutlined />
                                    )
                                  }
                                  onClick={() => toggleFavorite(listing.id)}
                                />
                              </Space>
                            </Space>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card>
                </Badge.Ribbon>
              ))}
            </Space>
          )}

          {/* Load More */}
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Button
              size="large"
              style={{
                backgroundColor: '#FF6B35',
                borderColor: '#FF6B35',
                color: 'white',
                fontWeight: 600,
                height: 48,
                paddingLeft: 32,
                paddingRight: 32,
              }}
              icon={<ShoppingCartOutlined />}
            >
              Load More Listings
            </Button>
          </div>
        </main>

        <Footer />
      </div>
    </BusinessProtected>
  );
}
