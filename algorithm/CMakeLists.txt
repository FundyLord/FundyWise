# CMakeLists.txt - build configuration placeholder

cmake_minimum_required(VERSION 3.15)

project(debt_optimizer)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

find_package(pybind11 REQUIRED)

pybind11_add_module(
    debt_optimizer
    bindings/pybind_wrapper.cpp
    cpp/debt_optimizer.cpp
)